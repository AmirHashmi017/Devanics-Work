import { useRef, useEffect, useState, useCallback } from "react";
import { gantt } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import axios from "axios";
import {
  Modal,
  Input,
  DatePicker,
  Form,
  Row,
  Col,
  Button,
  message,
  Card,
  Space,
  Select,
  Upload,
  Checkbox,
  Table,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  CopyOutlined,
  ScissorOutlined,
  SnippetsOutlined,
  UploadOutlined,
  DownloadOutlined,
  LinkOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import PropTypes from "prop-types";

const serverURL = `http://localhost:4000/backend/api/charts`;
const linksURL = `http://localhost:4000/backend/api/links`;

const columnsConfig = [
  { name: "code", label: "ID", width: 80, resize: true },
  { name: "text", label: "Name", tree: true, resize: true, editor: { type: "text", map_to: "text" } },
  { name: "start_date", label: "Start", resize: true, editor: { type: "date", map_to: "start_date" } },
  { name: "end_date", label: "End", resize: true, editor: { type: "date", map_to: "end_date" } },
  {
    name: "duration", label: "Dur", resize: true, editor: { type: "number", map_to: "duration" },
    template: (t) => {
      if (t.start && t.end) {
        const start = new Date(t.start);
        const finish = new Date(t.end);
        return Math.ceil((finish - start) / (1000 * 60 * 60 * 24));
      }
      return "";
    }
  },
  {
    name: "progress",
    label: "Progress",
    resize: true,
    editor: { type: "number", map_to: "progress" },
    template: (task) => `${Math.round((task.progress || 0) * 100)}%`,
  },
  { name: "actualStart", label: "Actual Start", resize: true, editor: { type: "date", map_to: "actualStart" } },
  { name: "actualFinish", label: "Actual Finish", resize: true, editor: { type: "date", map_to: "actualFinish" } },
  {
    name: "actualDuration",
    label: "Actual Dur",
    resize: true,
    template: (t) => {
      if (t.actualStart && t.actualFinish) {
        const start = new Date(t.actualStart);
        const finish = new Date(t.actualFinish);
        return Math.ceil((finish - start) / (1000 * 60 * 60 * 24));
      }
      return "";
    }
  },
  {
    name: "duration",
    label: "Duration",
    resize: true,
    template: (t) => {
      if (t.start && t.end) {
        const start = new Date(t.start);
        const finish = new Date(t.end);
        return Math.ceil((finish - start) / (1000 * 60 * 60 * 24));
      }
      return "";
    }
  },
  {
    name: "remaining",
    label: "Remaining",
    resize: true,
    template: (t) => {
      if (t.end) {
        const end = new Date(t.end);
        const today = new Date();
        const elapsed = Math.ceil((today - end) / (1000 * 60 * 60 * 24));
        return Math.max(0, (t.duration || 0) - elapsed);
      }
      return "";
    }
  },
  {
    name: "actualRemaining",
    label: "Actual Remaining",
    resize: true,
    template: (t) => {
      if (t.actualFinish) {
        const end = new Date(t.actualFinish);
        const today = new Date();
        const elapsed = Math.ceil((today - end) / (1000 * 60 * 60 * 24));
        return Math.max(0, (t.duration || 0) - elapsed);
      }
      return "";
    }
  },
  { name: "totalFloat", label: "Float", resize: true, editor: { type: "number", map_to: "totalFloat" } },
  { name: "activityType", label: "Activity Type", resize: true, editor: { type: "text", map_to: "activityType" } },
  {
    name: "type",
    label: "Type",
    resize: true,
    editor: {
      type: "select",
      map_to: "type",
      options: [
        { key: "task", label: "Task" },
        { key: "project", label: "Project" },
        { key: "milestone", label: "Milestone" },
      ],
    },
  },
];

const GanttChart = ({ project }) => {
  const userId = project?.userId?._id || project?.userId;
  const ganttContainer = useRef(null);
  const [form] = Form.useForm();
  const [modalTask, setModalTask] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLinksModalVisible, setIsLinksModalVisible] = useState(false);
  const [isColumnsModalVisible, setIsColumnsModalVisible] = useState(false);
  const [selectedCols, setSelectedCols] = useState(
    columnsConfig.map((c) => c.name)
  );
  const [tempSelectedCols, setTempSelectedCols] = useState([]);
  const [clipboard, setClipboard] = useState(null);
  const [taskLinks, setTaskLinks] = useState([]);
  const [zoomLevel, setZoomLevel] = useState("day");

  // State management for saves
  const [isSaving, setIsSaving] = useState(false);
  const isInitializedRef = useRef(false);
  const saveTimeoutRef = useRef(null);
  const actualLayerIdRef = useRef(null);
  const plannedLayerIdRef = useRef(null);

  const zoomLevels = {
    hour: { unit: "hour", format: "%H:%i", min_column_width: 60 },
    day: { unit: "day", format: "%d %M", min_column_width: 70 },
    week: { unit: "week", format: "Week %W", min_column_width: 100 },
    month: { unit: "month", format: "%F %Y", min_column_width: 120 },
    year: { unit: "year", format: "%Y", min_column_width: 150 }
  };

  // Direct save function (no debouncing for manual actions)
  const saveToServer = useCallback(async () => {
    if (isSaving || !isInitializedRef.current) return;

    setIsSaving(true);
    try {
      // Get all tasks (excluding empty ones)
      const tasks = [];
      gantt.eachTask((t) => {
        if (!t.text || t.text.trim() === "" || t.id.toString().startsWith("empty_")) {
          return;
        }

        tasks.push({
          id: t.id,
          text: t.text,
          start: t.start_date,
          end: t.end_date,
          duration: t.duration,
          actualDuration: t.actualDuration,
          remaining: t.remaining,
          actualRemaining: t.actualRemaining,
          progress: t.progress || 0,
          type: t.type,
          parent: t.parent,
          origin: "wbs",
          actualStart: t.actualStart,
          actualFinish: t.actualFinish,
          totalFloat: t.totalFloat || 0,
          activityType: t.activityType || "",
        });
      });

      // Get all links
      const links = gantt.getLinks().map((l) => ({
        id: l.id,
        source: l.source,
        target: l.target,
        type: ["s2s", "e2s", "s2e", "e2e"][l.type],
      }));

      // Save both tasks and links
      const [tasksResponse, linksResponse] = await Promise.all([
        axios.put(`${serverURL}/${userId}/${project._id}`, { tasks }),
        axios.put(`${linksURL}/${userId}/${project._id}`, { links })
      ]);

      if (tasksResponse.status === 200 && linksResponse.status === 200) {
        console.log("Data saved successfully");
      }
    } catch (err) {
      console.error("Save error:", err);
      message.error("Failed to save data: " + (err?.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  }, [userId, project._id, isSaving]);

  // Only debounce for automatic saves (inline editing)
  const debouncedAutoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveToServer();
    }, 1000);
  }, [saveToServer]);

  useEffect(() => {
    // Configure Gantt
    gantt.config.xml_date = "%Y-%m-%d";
    gantt.config.order_branch = true;
    gantt.config.open_tree_initially = true;
    gantt.config.auto_types = true;
    gantt.config.drag_links = true;
    gantt.config.drag_progress = true;
    gantt.config.grid_resize = true;
    gantt.config.columns = columnsConfig.filter((c) => selectedCols.includes(c.name));
    gantt.config.inline_editors = true;
    gantt.config.row_height = 30;

    // Configure default scale settings
    gantt.config.scale_unit = "day";
    gantt.config.date_scale = "%d %M";
    gantt.config.min_column_width = 50;

    // Visual task type styles
    gantt.templates.task_class = function (t) {
      if (t.type === "project") return "gantt_project";
      if (t.type === "milestone") return "gantt_milestone";
      return "";
    };

    // Fix progress display - show percentage in task bars
    gantt.templates.task_text = (start, end, task) => {
      return `${Math.round((task?.progress || 0) * 100)}%`;
    };

    // Custom progress bar template
    gantt.templates.progress_text = function (start, end, task) {
      return `<span style='text-align:left; display:none'>${Math.round((task?.progress || 0) * 100)}%</span>`;
    };

    // Event handlers
    gantt.attachEvent("onTaskDblClick", (id) => {
      try {
        const task = gantt.getTask(id);
        if (task.text && task.text.trim() !== "" && !task.id.toString().startsWith("empty_")) {
          openModal(id);
        }
      } catch (error) {
        console.error("Error handling task double click:", error);
      }
      return false;
    });

    // Only use debounced save for inline editing
    gantt.attachEvent("onAfterTaskUpdate", (id, task) => {
      if (isInitializedRef.current && task.text && task.text.trim() !== "") {
        debouncedAutoSave();
      }
    });

    // For drag and drop updates
    gantt.attachEvent("onAfterTaskDrag", (id, mode, e) => {
      if (isInitializedRef.current) {
        debouncedAutoSave();
      }
    });

    // Link events - auto save only
    gantt.attachEvent("onAfterLinkAdd", () => {
      if (isInitializedRef.current) {
        debouncedAutoSave();
      }
    });

    gantt.attachEvent("onAfterLinkUpdate", () => {
      if (isInitializedRef.current) {
        debouncedAutoSave();
      }
    });

    gantt.attachEvent("onAfterLinkDelete", () => {
      if (isInitializedRef.current) {
        debouncedAutoSave();
      }
    });

    gantt.init(ganttContainer.current);
    
    // Inject styles for Primavera-like visualization (once)
    const existing = document.querySelector("style[data-gantt-primavera]");
    if (!existing) {
      const style = document.createElement("style");
      style.setAttribute("data-gantt-primavera", "true");
      style.textContent = `
        .actual-dates-bar {
          position: absolute;
          background: rgba(255, 77, 79, 0.35);
          border: 2px solid #ff4d4f;
          border-radius: 2px;
          pointer-events: none;
          z-index: 2;
        }
        .planned-dates-bar {
          position: absolute;
          height: 4px;
          background: #595959;
          border-radius: 2px;
          pointer-events: none;
          z-index: 1;
        }
      `;
      document.head.appendChild(style);
    }

    // Add task layers for baseline (planned) and actual bars
    const drawPlannedLayer = function(task) {
      if (!task.start_date || !task.end_date) return false;
      const sizes = gantt.getTaskPosition(task, task.start_date, task.end_date);
      if (!sizes || sizes.width <= 0) return false;
      const el = document.createElement('div');
      el.className = 'planned-dates-bar';
      el.style.left = sizes.left + 'px';
      el.style.width = sizes.width + 'px';
      // place thin baseline at bottom of the task row
      const bottomOffset = 6; // px from bottom of row
      el.style.top = (sizes.top + gantt.config.task_height - bottomOffset) + 'px';
      return el;
    };

    const drawActualLayer = function(task) {
      const start = task.actualStart ? new Date(task.actualStart) : task.start_date;
      const end = task.actualFinish ? new Date(task.actualFinish) : task.end_date;
      if (!start || !end) return false;
      const sizes = gantt.getTaskPosition(task, start, end);
      if (!sizes || sizes.width <= 0) return false;
      const el = document.createElement('div');
      el.className = 'actual-dates-bar';
      el.style.left = sizes.left + 'px';
      el.style.width = sizes.width + 'px';
      // inset inside task row
      const verticalPadding = 2;
      el.style.top = (sizes.top + verticalPadding) + 'px';
      el.style.height = (gantt.config.task_height - verticalPadding * 2) + 'px';
      return el;
    };

    plannedLayerIdRef.current = gantt.addTaskLayer(drawPlannedLayer);
    actualLayerIdRef.current = gantt.addTaskLayer(drawActualLayer);
    
    // Ensure proper sizing and prevent overflow
    gantt.config.autosize = "y";
    gantt.config.fit_tasks = true;
    
    window.addEventListener("resize", () => {
      gantt.render();
      gantt.setSizes();
    });

    // Load data and mark as initialized
    loadFromServer().then(() => {
      isInitializedRef.current = true;
    });

    return () => {
      gantt.clearAll();
      isInitializedRef.current = false;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (plannedLayerIdRef.current) {
        gantt.removeTaskLayer(plannedLayerIdRef.current);
        plannedLayerIdRef.current = null;
      }
      if (actualLayerIdRef.current) {
        gantt.removeTaskLayer(actualLayerIdRef.current);
        actualLayerIdRef.current = null;
      }
      const styleTag = document.querySelector("style[data-gantt-primavera]");
      if (styleTag) styleTag.remove();
    };
  }, []);

  useEffect(() => {
    gantt.config.columns = columnsConfig.filter((c) =>
      selectedCols.includes(c.name)
    );
    gantt.render();
  }, [selectedCols]);

  const loadFromServer = async () => {
    try {
      setIsSaving(true);

      const [tasksRes, linksRes] = await Promise.all([
        axios.get(`${serverURL}/${userId}/${project._id}`),
        axios.get(`${linksURL}/${userId}/${project._id}`)
      ]);

      const tasks = tasksRes.data.tasks.map((t) => ({
        ...t,
        start_date: new Date(t.start),
        end_date: new Date(t.end),
        progress: t.progress || 0,
        actualStart: t.actualStart ? new Date(t.actualStart) : null,
        actualFinish: t.actualFinish ? new Date(t.actualFinish) : null,
        totalFloat: t.totalFloat || 0,
        actualDuration: t.actualDuration,
        duration: t.duration,
        remaining: t.remaining,
        actualRemaining: t.actualRemaining,
        activityType: t.activityType || "",
      }));

      const links = linksRes.data.links.map((l) => ({
        ...l,
        type: ["s2s", "e2s", "s2e", "e2e"].indexOf(l.type),
      }));

      gantt.clearAll();
      gantt.parse({ data: tasks, links: links });
      
      // Ensure proper sizing after data is loaded
      setTimeout(() => {
        gantt.setSizes();
        gantt.render();
      }, 100);
      
      // addEmptyRows();

    } catch (err) {
      console.error("Load error:", err);
      message.error("Load failure: " + (err?.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  const addEmptyRows = () => {
    for (let i = 0; i < 2; i++) {
      gantt.addTask({
        id: `empty_${Date.now()}_${i}`,
        text: "",
        parent: 0,
        progress: 0,
        start_date: new Date(),
        end_date: dayjs().add(1, "day").toDate(),
        duration: 1,
      });
    }
  };

  const handleAddTask = async () => {
    const newTask = {
      id: `task_${Date.now()}`,
      text: "New Task",
      start_date: new Date(),
      end_date: dayjs().add(1, "day").toDate(),
      duration: 1,
      type: "task",
      progress: 0,
      parent: 0,
    };

    try {
      gantt.addTask(newTask);

      // Save all current tasks immediately
      await saveToServer();
      message.success("Task added successfully");
    } catch (err) {
      message.error("Failed to add task: " + (err?.message || "Unknown error"));
      gantt.deleteTask(newTask.id);
    }
  };

  const handleAddSubTask = async () => {
    const selectedId = gantt.getSelectedId();
    if (!selectedId) {
      message.warning("Please select a parent task");
      return;
    }

    const selectedTask = gantt.getTask(selectedId);
    if (!selectedTask.text || selectedTask.text.trim() === "" || selectedTask.id.toString().startsWith("empty_")) {
      message.warning("Please select a valid parent task");
      return;
    }

    const subTask = {
      id: `task_${Date.now()}`,
      text: "New SubTask",
      start_date: new Date(),
      end_date: dayjs().add(1, "day").toDate(),
      duration: 1,
      type: "task",
      progress: 0,
      parent: selectedId,
    };

    try {
      gantt.open(selectedId);
      gantt.addTask(subTask);

      // Save all current tasks immediately
      await saveToServer();
      message.success("SubTask added successfully");
    } catch (err) {
      message.error("Failed to add subtask: " + (err?.message || "Unknown error"));
      gantt.deleteTask(subTask.id);
    }
  };

  const openModal = (id) => {
    const t = gantt.getTask(id);
    setModalTask(t);
    form.setFieldsValue({
      text: t.text,
      start: [dayjs(t.start_date), dayjs(t.end_date)],
      // actualDuration: t.actualDuration,
      // remaining: t.remaining,
      // actualRemaining: t.actualRemaining,
      type: t.type,
      progress: Math.round((t.progress || 0) * 100),
      actualStart: t.actualStart && t.actualFinish
        ? [dayjs(t.actualStart), dayjs(t.actualFinish)]
        : [t.actualStart ? dayjs(t.actualStart) : null, null],
      totalFloat: t.totalFloat || 0,
      activityType: t.activityType || "",
      activityCalendar: t.activityCalendar || "",
    });
    setIsModalVisible(true);
  };

  const onModalSave = async () => {
    try {
      const vals = await form.validateFields();

      Object.assign(modalTask, {
        text: vals.text,
        start_date: vals.start[0].toDate(),
        end_date: vals.start[1].toDate(),
        type: vals.type,
        progress: (vals.progress || 0) / 100,
        duration: Math.ceil((vals.start[1] - vals.start[0]) / (1000 * 60 * 60 * 24)),
        actualDuration: Math.ceil((vals.actualStart[1] - vals.actualStart[0]) / (1000 * 60 * 60 * 24)),
        actualStart: vals.actualStart?.[0] ? vals.actualStart[0].toDate() : null,
        actualFinish: vals.actualStart?.[1] ? vals.actualStart[1].toDate() : null,
        totalFloat: vals.totalFloat || 0,
        activityType: vals.activityType || "",
        claimedAt: vals.claimedAt ? vals.claimedAt.toDate() : null,
      });

      gantt.updateTask(modalTask.id);
      setIsModalVisible(false);

      // Save immediately
      await saveToServer();
      message.success("Task updated successfully");
    } catch (error) {
      console.error("Modal save error:", error);
      message.error("Failed to update task: " + (error?.message || "Unknown error"));
    }
  };

  const openLinksModal = () => {
    const selectedId = gantt.getSelectedId();
    if (!selectedId) {
      message.warning("Please select a task");
      return;
    }

    const selectedTask = gantt.getTask(selectedId);
    if (!selectedTask.text || selectedTask.text.trim() === "" || selectedTask.id.toString().startsWith("empty_")) {
      message.warning("Please select a valid task");
      return;
    }

    const allLinks = gantt.getLinks();
    const taskRelatedLinks = allLinks.filter(link =>
      link.source === selectedId || link.target === selectedId
    );

    const linksData = taskRelatedLinks.map((link, index) => {
      const sourceTask = gantt.getTask(link.source);
      const targetTask = gantt.getTask(link.target);
      const typeLabels = ["Start-to-Start", "End-to-Start", "Start-to-End", "End-to-End"];

      return {
        key: index,
        id: link.id,
        source: link.source,
        target: link.target,
        sourceText: sourceTask.text,
        targetText: targetTask.text,
        type: link.type,
        typeLabel: typeLabels[link.type] || "Unknown",
      };
    });

    setTaskLinks(linksData);
    setIsLinksModalVisible(true);
  };

  const updateLinkType = async (linkId, newType) => {
    try {
      const link = gantt.getLink(linkId);
      if (link) {
        link.type = newType;
        gantt.updateLink(linkId);

        // Refresh modal data
        const allLinks = gantt.getLinks();
        const selectedId = gantt.getSelectedId();
        const taskRelatedLinks = allLinks.filter(l =>
          l.source === selectedId || l.target === selectedId
        );

        const linksData = taskRelatedLinks.map((l, index) => {
          const sourceTask = gantt.getTask(l.source);
          const targetTask = gantt.getTask(l.target);
          const typeLabels = ["Start-to-Start", "End-to-Start", "Start-to-End", "End-to-End"];

          return {
            key: index,
            id: l.id,
            source: l.source,
            target: l.target,
            sourceText: sourceTask.text,
            targetText: targetTask.text,
            type: l.type,
            typeLabel: typeLabels[l.type] || "Unknown",
          };
        });

        setTaskLinks(linksData);

        // Save immediately
        await saveToServer();
        message.success("Link updated successfully");
      }
    } catch (error) {
      message.error("Failed to update link");
    }
  };

  const deleteLink = async (linkId) => {
    try {
      gantt.deleteLink(linkId);

      // Refresh modal data
      const allLinks = gantt.getLinks();
      const selectedId = gantt.getSelectedId();
      const taskRelatedLinks = allLinks.filter(l =>
        l.source === selectedId || l.target === selectedId
      );

      const linksData = taskRelatedLinks.map((l, index) => {
        const sourceTask = gantt.getTask(l.source);
        const targetTask = gantt.getTask(l.target);
        const typeLabels = ["Start-to-Start", "End-to-Start", "Start-to-End", "End-to-End"];

        return {
          key: index,
          id: l.id,
          source: l.source,
          target: l.target,
          sourceText: sourceTask.text,
          targetText: targetTask.text,
          type: l.type,
          typeLabel: typeLabels[l.type] || "Unknown",
        };
      });

      setTaskLinks(linksData);

      // Save immediately
      await saveToServer();
      message.success("Link deleted successfully");
    } catch (error) {
      message.error("Failed to delete link");
    }
  };

  const copy = () => {
    const selectedId = gantt.getSelectedId();
    if (!selectedId) {
      message.warning("Please select a task");
      return;
    }
    const selectedTask = gantt.getTask(selectedId);
    if (!selectedTask.text || selectedTask.text.trim() === "" || selectedTask.id.toString().startsWith("empty_")) {
      message.warning("Cannot copy empty task");
      return;
    }
    setClipboard({ id: selectedId, mode: "copy" });
    message.success("Task copied");
  };

  const cut = () => {
    const selectedId = gantt.getSelectedId();
    if (!selectedId) {
      message.warning("Please select a task");
      return;
    }
    const selectedTask = gantt.getTask(selectedId);
    if (!selectedTask.text || selectedTask.text.trim() === "" || selectedTask.id.toString().startsWith("empty_")) {
      message.warning("Cannot cut empty task");
      return;
    }
    setClipboard({ id: selectedId, mode: "cut" });
    message.success("Task cut");
  };

  const paste = async () => {
    if (!clipboard) {
      message.warning("Nothing to paste");
      return;
    }
    const { id, mode } = clipboard;
    const newId = `task_${Date.now()}`;

    try {
      const success = gantt.copy(id, mode === "cut", newId);
      if (success) {
        if (mode === "cut") setClipboard(null);

        // Save immediately
        await saveToServer();
        message.success("Task pasted");
      }
    } catch (err) {
      message.error("Failed to paste task");
    }
  };

  const move = async (dir) => {
    const sel = gantt.getSelectedId();
    if (!sel) {
      message.warning("Please select a task");
      return;
    }

    const selectedTask = gantt.getTask(sel);
    if (!selectedTask.text || selectedTask.text.trim() === "" || selectedTask.id.toString().startsWith("empty_")) {
      message.warning("Cannot move empty task");
      return;
    }

    try {
      const parent = gantt.getParent(sel);
      const siblings = gantt.getChildren(parent);
      const currentIndex = siblings.indexOf(sel);

      if (dir === -1 && currentIndex > 0) {
        gantt.moveTask(sel, currentIndex - 1, parent);
        await saveToServer();
        message.success("Task moved up");
      } else if (dir === 1 && currentIndex < siblings.length - 1) {
        gantt.moveTask(sel, currentIndex + 1, parent);
        await saveToServer();
        message.success("Task moved down");
      }
    } catch (error) {
      message.error("Failed to move task");
    }
  };

  const updateZoom = (level) => {
    const config = zoomLevels[level];
    if (config) {
      gantt.config.scale_unit = config.unit;
      gantt.config.date_scale = config.format;
      gantt.config.min_column_width = config.min_column_width;
      gantt.render();
      setZoomLevel(level);
    }
  };

  const zoomIn = () => {
    const levels = Object.keys(zoomLevels);
    const currentIndex = levels.indexOf(zoomLevel);
    if (currentIndex > 0) {
      updateZoom(levels[currentIndex - 1]);
    }
  };

  const zoomOut = () => {
    const levels = Object.keys(zoomLevels);
    const currentIndex = levels.indexOf(zoomLevel);
    if (currentIndex < levels.length - 1) {
      updateZoom(levels[currentIndex + 1]);
    }
  };

  const handleColumnSelection = (checkedValues) => {
    setTempSelectedCols(checkedValues);
  };

  const saveColumnSelection = () => {
    setSelectedCols(tempSelectedCols);
    setIsColumnsModalVisible(false);
    message.success("Column selection saved");
  };

  const cancelColumnSelection = () => {
    setTempSelectedCols(selectedCols);
    setIsColumnsModalVisible(false);
  };

  const openColumnsModal = () => {
    setTempSelectedCols(selectedCols);
    setIsColumnsModalVisible(true);
  };

  const linkColumns = [
    {
      title: 'Predecessor',
      dataIndex: 'sourceText',
      key: 'sourceText',
    },
    {
      title: 'Successor',
      dataIndex: 'targetText',
      key: 'targetText',
    },
    {
      title: 'Relationship',
      key: 'type',
      render: (_, record) => (
        <Select
          value={record.type}
          onChange={(value) => updateLinkType(record.id, value)}
          style={{ width: 150 }}
        >
          <Select.Option value={0}>Start-to-Start</Select.Option>
          <Select.Option value={1}>End-to-Start</Select.Option>
          <Select.Option value={2}>Start-to-End</Select.Option>
          <Select.Option value={3}>End-to-End</Select.Option>
        </Select>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => deleteLink(record.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <>
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Button
            icon={<PlusOutlined />}
            onClick={handleAddTask}
            type="primary"
            loading={isSaving}
          >
            Add Task
          </Button>
          <Button
            icon={<PlusOutlined />}
            onClick={handleAddSubTask}
            loading={isSaving}
          >
            Add SubTask
          </Button>
          <Button icon={<ArrowUpOutlined />} onClick={() => move(-1)} disabled={isSaving}>
            Move Up
          </Button>
          <Button icon={<ArrowDownOutlined />} onClick={() => move(1)} disabled={isSaving}>
            Move Down
          </Button>
          <Button icon={<CopyOutlined />} onClick={copy}>
            Copy
          </Button>
          <Button icon={<ScissorOutlined />} onClick={cut}>
            Cut
          </Button>
          <Button icon={<SnippetsOutlined />} onClick={paste} disabled={isSaving}>
            Paste
          </Button>
          <Button icon={<LinkOutlined />} onClick={openLinksModal}>
            Links
          </Button>
          <Button icon={<ZoomInOutlined />} onClick={zoomIn} disabled={zoomLevel === "hour"}>
            Zoom In
          </Button>
          <Button icon={<ZoomOutOutlined />} onClick={zoomOut} disabled={zoomLevel === "year"}>
            Zoom Out
          </Button>
          <Select
            value={zoomLevel}
            onChange={updateZoom}
            style={{ width: 100 }}
            size="small"
          >
            <Select.Option value="hour">Hour</Select.Option>
            <Select.Option value="day">Day</Select.Option>
            <Select.Option value="week">Week</Select.Option>
            <Select.Option value="month">Month</Select.Option>
            <Select.Option value="year">Year</Select.Option>
          </Select>
          <Upload
            accept=".json"
            showUploadList={false}
            beforeUpload={(file) => {
              const r = new FileReader();
              r.onload = async () => {
                try {
                  gantt.clearAll();
                  gantt.parse(JSON.parse(r.result));
                  await saveToServer();
                  message.success("Data imported successfully");
                } catch {
                  message.error("Invalid JSON file");
                }
              };
              r.readAsText(file);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>Import JSON</Button>
          </Upload>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => {
              const blob = new Blob([JSON.stringify(gantt.serialize())], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "gantt.json";
              a.click();
              URL.revokeObjectURL(url);
              message.success("Data exported successfully");
            }}
          >
            Export JSON
          </Button>
          <Button
            icon={<EyeOutlined />}
            onClick={openColumnsModal}
          >
            Columns
          </Button>
          {isSaving && (
            <span style={{ color: '#1890ff', fontSize: '12px' }}>
              Saving...
            </span>
          )}
        </Space>
      </Card>

      <div
        ref={ganttContainer}
        style={{
          width: "100%",
          height: "500px",
          border: "1px solid #d9d9d9",
          borderRadius: "6px",
          overflow: "hidden",
          position: "relative",
          maxHeight: "600px",
          minHeight: "400px"
        }}
        className="gantt-container"
      />

      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={onModalSave}
        width={600}
        style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '24px',
          top: 20,
        }}
      >
        <h4 style={{ color: '#1890ff', fontWeight: 'bold' }}>Edit Task</h4>

        <Form form={form} layout="vertical">
          <Form.Item name="text" label="Name" rules={[{ required: true, message: 'Please enter task name' }]}>
            <Input placeholder="Enter task name" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="start" label="Start - End Date" rules={[{ required: true, message: 'Please select start and end dates' }]}>
                <DatePicker.RangePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="actualStart" label="Actual Start - Actual Finish">
                <DatePicker.RangePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="Type">
                <Select placeholder="Select type">
                  <Select.Option value="task">Task</Select.Option>
                  <Select.Option value="project">Project</Select.Option>
                  <Select.Option value="milestone">Milestone</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="progress" label="Progress (%)">
                <Input type="number" min={0} max={100} placeholder="0-100" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="totalFloat" label="Total Float">
                <Input type="number" placeholder="Enter total float" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="activityType" label="Activity Type">
                <Input placeholder="Enter activity type" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="claimedAt" label="Claimed At">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Links Modal */}
      <Modal
        open={isLinksModalVisible}
        title={<span style={{ color: '#1890ff', fontWeight: 'bold' }}>Task Links</span>}
        onCancel={() => setIsLinksModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsLinksModalVisible(false)}>
            Close
          </Button>
        ]}
        width={700}
        bodyStyle={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}
      >
        <Table
          dataSource={taskLinks}
          columns={linkColumns}
          pagination={false}
          size="small"
        />
      </Modal>

      {/* Column Selection Modal */}
      <Modal
        open={isColumnsModalVisible}
        title={<span style={{ color: '#1890ff', fontWeight: 'bold' }}>Select Columns</span>}
        onCancel={cancelColumnSelection}
        onOk={saveColumnSelection}
        bodyStyle={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}
      >
        <Checkbox.Group
          options={columnsConfig.map(col => ({
            label: col.label,
            value: col.name,
          }))}
          value={tempSelectedCols}
          onChange={handleColumnSelection}
          style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
        />
      </Modal>
    </>
  );
};

GanttChart.propTypes = {
  project: PropTypes.object.isRequired,
};

export default GanttChart;