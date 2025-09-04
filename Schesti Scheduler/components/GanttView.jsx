import { useRef, useEffect, useState, useCallback } from "react";
import { gantt } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { backend_url, backend_url_core } from "../constants/api";



const columnsConfig = [
  { name: "taskId", label: "ID", width: 120,resize: true, editor: { type: "text", map_to: "taskId" },tree: true },
  { name: "text", label: "Activities", width: 120, resize: true, editor: { type: "text", map_to: "text" } },
  {
  name: "duration", // Change from "duration" to "originalDuration"
  label: "Original Duration",
  width: 60,
  resize: true,
  editor: { type: "number", map_to: "originalDuration" }, // Change here too
  template: function(task) {
    return task.originalDuration || "";
  }
},
  {
    name: "status",
    label: "Status",
    width: 100,
    resize: true,
    editor: {
       type: "select",
       map_to: "status",
       options: [
        { key: "Planned", label: "Planned" },
        { key: "In Progress", label: "In Progress" },
        { key: "Completed", label: "Completed" },
      ]
    },
    template: (task) => {
      const status = task.status || "Planned";
      let color = "#666";
      switch(status) {
        case "Planned":
          color = "#666";
          break;
        case "In Progress":
          color = "#1890ff";
          break;
        case "Completed":
          color = "#52c41a";
          break;
        default:
          color = "#666";
      }
      return `<span style="color: ${color}; font-weight: 500;">${status}</span>`;
    },
  },
  { 
  name: "start_date", 
  label: "Start", 
  width: 110, 
  resize: true, 
  editor: { type: "date", map_to: "start_date" },
  template: function(task) {
    if (task.start_date) {
      return gantt.date.date_to_str("%Y-%m-%d")(task.start_date);
    }
    return "";
  }
},
{ 
  name: "end_date", 
  label: "Finish", 
  width: 110, 
  resize: true, 
  editor: { type: "date", map_to: "end_date" },
  template: function(task) {
    if (task.end_date) {
      return gantt.date.date_to_str("%Y-%m-%d")(task.end_date);
    }
    return "";
  }
},
  { name: "actualStart", label: "Actual Start", width: 110, resize: true, editor: { type: "date", map_to: "actualStart" } },
  { name: "actualFinish", label: "Actual Finish", width: 110, resize: true, editor: { type: "date", map_to: "actualFinish" } },
  {
    name: "remduration",
    label: "Remaining Duration",
    width: 70,
    resize: true,
    editor: { type: "number", map_to: "remduration" },
    template: (t) => {
      if (t.progress === 1 || t.progress === 100) return 0;
      if (!t.actualStart) return t.duration;
      if (typeof t.remduration === 'number') return t.remduration;
      if (typeof t.duration === 'number' && typeof t.progress === 'number') {
        return Math.ceil(t.duration * (1 - t.progress));
      }
      return t.duration || '';
    },
  },
  {
    name: "progress",
    label: "Schedule% Completed",
    width: 80,
    resize: true,
    editor: { type: "number", map_to: "progress" },
    template: (task) => `${Math.round((task.progress || 0) * 100)}%`,
  },
  { name: "totalFloat", label: "Total Float", width: 60, resize: true, editor: { type: "number", map_to: "totalFloat" } },
  { name: "activityType", label: "Activity Type", width: 100, resize: true, editor: { type: "text", map_to: "activityType" } },
  {
    name: "predecessors",
    label: "Predecessors",
    width: 180,
    resize: true,
    template: (t) => {
      try {
        const preds = Array.isArray(t.predecessor) ? t.predecessor : [];
        if (!preds.length) return "";
        const names = preds
          .map((p) => {
            try {
              const task = gantt.getTask(p.taskId);
              return task?.text ? `${p.relation} - ${task.text}` : "";
            } catch (_) {
              return "";
            }
          })
          .filter(Boolean);
        const shown = names.slice(0, 2).join(", ");
        return preds.length > 2 && shown ? `${shown}, ...` : shown;
      } catch (_) {
        return "";
      }
    },
  },
  {
    name: "successors",
    label: "Successors",
    width: 180,
    resize: true,
    template: (t) => {
      try {
        const succs = Array.isArray(t.successors) ? t.successors : [];
        if (!succs.length) return "";
        const names = succs
          .map((s) => {
            try {
              const task = gantt.getTask(s.taskId);
              return task?.text ? `${s.relation} - ${task.text}` : "";
            } catch (_) {
              return "";
            }
          })
          .filter(Boolean);
        const shown = names.slice(0, 2).join(", ");
        return succs.length > 2 && shown ? `${shown}, ...` : shown;
      } catch (_) {
        return "";
      }
    },
  },
];

const GanttChart = ({ project, isVisualizationOpen, onToggleVisualization, activeTab, onTasksChange }) => {
  const userId = project?.userId?._id || project?.userId;
  const ganttContainer = useRef(null);
  const [form] = Form.useForm();
  const [predecessorForm] = Form.useForm();
  const [successorForm] = Form.useForm();
  const [modalTask, setModalTask] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLinksModalVisible, setIsLinksModalVisible] = useState(false);
  const [isColumnsModalVisible, setIsColumnsModalVisible] = useState(false);
  const [selectedCols, setSelectedCols] = useState(
    columnsConfig.map((c) => c.name) // Include all columns by default
  );
  const [tempSelectedCols, setTempSelectedCols] = useState([]);
  const [clipboard, setClipboard] = useState(null);
  const [taskLinks, setTaskLinks] = useState([]);
  const [zoomLevel, setZoomLevel] = useState("month");
  const [isSaving, setIsSaving] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const isInitializedRef = useRef(false);
  const saveTimeoutRef = useRef(null);
  const originalModalTaskDatesRef = useRef({ start: null, end: null });
  const [isDeleteLinkModalVisible, setIsDeleteLinkModalVisible] = useState(false);
const [selectedLinkId, setSelectedLinkId] = useState(null);

  const zoomLevels = {
  day: { unit: "day", format: "%d %M", min_column_width: 50 },
  week: { unit: "week", format: "%d %M", min_column_width: 60 },
  month: { unit: "month", format: "%F %Y", min_column_width: 80 },
  quarter: { unit: "quarter", format: "Q%q %Y", min_column_width: 100 },
  year: { unit: "year", format: "%Y", min_column_width: 120 },
};

  const linkTypeMap = {
    0: "SS",
    1: "FS",
    2: "SF",
    3: "FF",
  };

  const reverseLinkTypeMap = {
    SS: 0,
    FS: 1,
    SF: 2,
    FF: 3,
  };

  const syncTasksFromCurrentLinks = useCallback(() => {
    try {
      const links = gantt.getLinks();
      const predecessorMap = new Map();
      const successorMap = new Map();
      links.forEach((l) => {
        const relation = linkTypeMap[l.type];
        if (!relation) return;
        if (!predecessorMap.has(l.target)) predecessorMap.set(l.target, []);
        if (!successorMap.has(l.source)) successorMap.set(l.source, []);
        predecessorMap.get(l.target).push({ taskId: l.source, relation });
        successorMap.get(l.source).push({ taskId: l.target, relation });
      });
      setAllTasks((prev) =>
        prev.map((t) => ({
          ...t,
          predecessor: predecessorMap.get(t.id) || [],
          successors: successorMap.get(t.id) || [],
        }))
      );
    } catch (_) {
      // noop
    }
  }, []);

 const saveToServer = useCallback(async () => {
  // if (isSaving || !isInitializedRef.current) return;
  setIsSaving(true);
  try {
    const tasks = [];
    gantt.eachTask((t) => {
      if (!t.text || t.text.trim() === "" || t.id.toString().startsWith("empty_")) {
        return;
      }
      const predecessors = gantt
        .getLinks()
        .filter((l) => l.target === t.id)
        .map((l) => ({
          taskId: gantt.getTask(l.source).id,
          relation: linkTypeMap[l.type],
        }));
      const successors = gantt
        .getLinks()
        .filter((l) => l.source === t.id)
        .map((l) => ({
          taskId: gantt.getTask(l.target).id,
          relation: linkTypeMap[l.type],
        }));
      tasks.push({
        id: t.id,
        taskId: t.taskId,
        text: t.text,
        start: t.start_date,
        end: t.end_date,
        duration: t.originalDuration || t.duration,
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
        status: t.status || "Planned",
        predecessor: predecessors,
        successors: successors,
      });
    });
    const tasksResponse = await axios.put(`${backend_url}/charts/${userId}/${project._id}`, { tasks });
    if (tasksResponse.status === 200) {
      // Use the response data directly
      const updatedTasks = tasksResponse.data.tasks.map((t) => ({
        ...t,
        start_date: new Date(t.start),
        end_date: new Date(t.end),
        originalDuration: t.duration||1,
        duration: t.duration || 1,
        progress: t.progress || 0,
        actualStart: t.actualStart ? new Date(t.actualStart) : null,
        actualFinish: t.actualFinish ? new Date(t.actualFinish) : null,
        totalFloat: t.totalFloat || 0,
        activityType: t.activityType || "",
        status: t.status || "Planned",
        predecessor: t.predecessor || [],
        successors: t.successors || [],
      }));
      // Validate and create links from predecessors and successors
      const validTaskIds = new Set(updatedTasks.map((t) => t.id));
      const validLinks = updatedTasks.reduce((acc, task) => {
        const taskLinks = [];
        (task.predecessor || []).forEach((pred) => {
          if (validTaskIds.has(pred.taskId) && validTaskIds.has(task.id)) {
            taskLinks.push({
              id: `link_pred_${task.id}_${pred.taskId}`,
              source: pred.taskId,
              target: task.id,
              type: reverseLinkTypeMap[pred.relation] || 1,
            });
          } else {
            console.warn(`Invalid predecessor link filtered out: source=${pred.taskId}, target=${task.id}`);
          }
        });
        (task.successors || []).forEach((succ) => {
          if (validTaskIds.has(task.id) && validTaskIds.has(succ.taskId)) {
            taskLinks.push({
              id: `link_succ_${task.id}_${succ.taskId}`,
              source: task.id,
              target: succ.taskId,
              type: reverseLinkTypeMap[succ.relation] || 1,
            });
          } else {
            console.warn(`Invalid successor link filtered out: source=${task.id}, target=${succ.taskId}`);
          }
        });
        return [...acc, ...taskLinks];
      }, []);
      // Update state and Gantt chart
      // setAllTasks(updatedTasks);
      // gantt.clearAll();
      try {
        gantt.parse({ data: updatedTasks, links: validLinks });
        // gantt.render();
        // gantt.setSizes();
      } catch (parseError) {
        console.error("Error parsing Gantt data:", parseError);
        message.error("Failed to update Gantt chart: Invalid data format");
      }
      console.log("Data saved successfully");
      if (onTasksChange) {
        onTasksChange();
      }
    }
  } catch (err) {
    console.error("Save error:", err);
    message.error("Failed to save data: " + (err?.message || "Unknown error"));
  } finally {
    setIsSaving(false);
  }
}, [userId, project._id, isSaving, reverseLinkTypeMap]);

  const debouncedAutoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveToServer();
    }, 1000);
  }, [saveToServer]);

  const updateGanttLayout = useCallback(() => {
    if (!isInitializedRef.current || !ganttContainer.current) return;
    if (isVisualizationOpen) {
      const containerWidth = ganttContainer.current.offsetWidth;
      gantt.config.grid_width = Math.floor(containerWidth * 0.5);
      gantt.config.show_chart = true;
    } else {
      gantt.config.grid_width = "100%";
      gantt.config.show_chart = false;
    }
    gantt.config.columns = columnsConfig.filter((c) => selectedCols.includes(c.name));
    gantt.render();
    gantt.setSizes();
  }, [isVisualizationOpen, selectedCols]);

  const checkAndAutoUpdateTaskStatuses = useCallback(async () => {
    if (!isInitializedRef.current || allTasks.length === 0) return;

    let tasksChanged = false;
    const updatedTasks = allTasks.map(task => {
      const today = dayjs().startOf('day');
      const actualStart = task.actualStart ? dayjs(task.actualStart).startOf('day') : null;
      const actualFinish = task.actualFinish ? dayjs(task.actualFinish).startOf('day') : null;

      let newStatus = task.status;
      let newProgress = task.progress;

      if (actualFinish && today.isAfter(actualFinish, 'day') && newStatus !== "Completed") {
        newStatus = "Completed";
        newProgress = 1;
      } else if (actualStart && today.isAfter(actualStart, 'day') && newStatus === "Planned") {
        newStatus = "In Progress";
        if (task.duration && task.duration > 0) {
          const elapsedDays = today.diff(actualStart, 'day');
          newProgress = Math.min(1, elapsedDays / task.duration);
        } else {
          newProgress = 0;
        }
      } else if (newStatus === "Planned") {
        newProgress = task.progress;
      }

      if (newStatus !== task.status || newProgress !== task.progress) {
        tasksChanged = true;
        return { ...task, status: newStatus, progress: newProgress };
      }
      return task;
    });

    if (tasksChanged) {
      setAllTasks(updatedTasks);
      updatedTasks.forEach(task => {
        const oldTask = allTasks.find(t => t.id === task.id);
        if (oldTask && (oldTask.status !== task.status || oldTask.progress !== task.progress)) {
          if (gantt.getTask(task.id)) {
            Object.assign(gantt.getTask(task.id), task);
            gantt.updateTask(task.id);
          }
        }
      });
      message.info("Task statuses and progress updated automatically based on actual dates.");
    }
  }, [allTasks]);

  useEffect(() => {
    gantt.config.xml_date = "%Y-%m-%d";
    gantt.templates.task_duration = function(start, end, task) {
  return task.duration || 1;
};

// Override the grid cell template specifically for duration column
gantt.templates.grid_date_format = function(date, column) {
  if (column === "duration") {
    return "";  // This prevents auto-formatting
  }
  return gantt.date.date_to_str(gantt.config.date_format)(date);
};
    gantt.config.order_branch = true;
    gantt.config.open_tree_initially = activeTab === "activities";
    gantt.config.auto_types = true;
    gantt.config.drag_links = true;
    gantt.config.drag_progress = true;
    gantt.config.grid_resize = true;
    gantt.config.inline_editors = true;
    gantt.config.row_height = 30;
    gantt.config.autosize = "y";
    gantt.config.fit_tasks = true;
    gantt.config.show_quick_info = false;
    gantt.config.show_task_cells = false;
    gantt.config.auto_scheduling = false;
    gantt.config.duration_calculation = false;
    gantt.config.duration_calculation = "none";

    if (isVisualizationOpen) {
      gantt.config.grid_width = 400;
      gantt.config.show_chart = true;
    } else {
      gantt.config.grid_width = "100%";
      gantt.config.show_chart = false;
    }
   gantt.eachTask((task) => {
  if (activeTab === "projects") {
    gantt.close(task.id); // All tasks closed by default in Projects tab
  } else if (activeTab === "wbs") {
    if (task.type === "project") {
      gantt.open(task.id); // Projects open in WBS tab
    } else {
      gantt.close(task.id); // WBS and activities closed
    }
  } else if (activeTab === "activities") {
    gantt.open(task.id); // All open in Activities tab
  }
});

     gantt.config.columns = isVisualizationOpen
      ? columnsConfig.filter((c) => selectedCols.includes(c.name) && [
          'taskId', 'text', 'duration', 'status', 'start_date'
        ].includes(c.name))
      : columnsConfig.filter((c) => selectedCols.includes(c.name));

    gantt.config.scale_unit = "month";
gantt.config.date_scale = "%F %Y";
gantt.config.min_column_width = 30;

    gantt.templates.date_scale = function(date) {
      const d = new Date(date);
      const startOfWeek = new Date(d);
      startOfWeek.setDate(d.getDate() - d.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      const startDay = startOfWeek.getDate();
      const endDay = endOfWeek.getDate();
      const startMonth = startOfWeek.toLocaleDateString('en', {month: 'short'});
      const endMonth = endOfWeek.toLocaleDateString('en', {month: 'short'});
      if (startMonth === endMonth) {
        return `${startMonth} ${startDay}-${endDay}`;
      } else {
        return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
      }
    };
    gantt.attachEvent("onTaskLoading", function(task) {
  if (!task.status) {
    task.status = "Planned";
  }
  // Force preserve backend duration
  if (typeof task.duration !== 'undefined') {
    Object.defineProperty(task, 'duration', {
      value: task.duration,
      writable: true,
      enumerable: true,
      configurable: true
    });
  }
  return true;
});

gantt.attachEvent("onTaskCreated", function(task) {
  // Restore the backend duration after creation
  if (task._duration) {
    task.duration = task._duration;
  }
  return true;
});
      gantt.attachEvent("onTaskClick", (id, e) => {
    try {
      const task = gantt.getTask(id);
      if (task.text && task.text.trim() !== "" && !task.id.toString().startsWith("empty_")) {
        gantt.selectTask(id); // Explicitly select the task
        return true; // Allow other click-related behaviors (e.g., inline editing)
      }
    } catch (error) {
      console.error("Error handling task click:", error);
    }
    return false; // Prevent default behavior for invalid tasks
  });

    const style = document.createElement('style');
    style.setAttribute('data-gantt-custom', 'true');
    style.textContent = `
      .gantt_container {
        font-size: 12px !important;
        height: 100% !important;
        width: 100% !important;
      }
      .gantt_grid_scale .gantt_grid_head_cell {
        font-size: 11px !important;
        padding: 4px !important;
        white-space: normal !important;
        word-break: break-word !important;
        min-height: 32px !important;
        line-height: 1.2 !important;
        vertical-align: middle !important;
        text-align: center;
        font-weight: bold !important;
      }
      .gantt_grid_data .gantt_cell {
        font-size: 11px !important;
        padding: 4px !important;
        white-space: normal !important;
        word-break: break-word !important;
        min-height: 32px !important;
        line-height: 1.2 !important;
        vertical-align: middle !important;
        text-align: center;
      }
      .gantt_task {
        border-radius: 4px !important;
        position: relative !important;
      }
       .ant-space {
  margin: 0 !important; /* Remove all margins */
  padding: 0 !important;
}
.ant-space-item:first-child {
  margin-left: 0 !important; /* Explicitly remove left margin for the first button */
}
.ant-space-item {
  margin-right: 4px !important; /* Matches size={4} for spacing between buttons */
}
        
      .gantt_scale_cell {
        font-size: 11px !important;
        font-weight: 500 !important;
        color: #333 !important;
      }
      .gantt_scale_line {
        background: #f8f9fa !important;
        border-bottom: 1px solid #e9ecef !important;
      }
      .gantt_scale_line .gantt_scale_cell {
        border-right: 1px solid #e9ecef !important;
      }
      .gantt_grid_data .gantt_cell[aria-colindex='2'] {
        text-align: left !important;
      }
      .gantt_task_line.status_planned {
        background-color: #00000024 !important;
      }
      .gantt_task_line.status_in_progress {
        background-color: #007AB680 !important;
      }
      .gantt_task_line.status_completed {
        background-color: #0EA26380 !important;
      }
      .gantt_task_progress {
        opacity: 1 !important;
      }
      .status_planned .gantt_task_progress {
        background-color: #000000CC !important;
        opacity: 0.8 !important;
      }
      .status_in_progress .gantt_task_progress {
        background-color: #007AB680 !important;
        opacity: 1 !important;
      }
      .status_completed .gantt_task_progress {
        background-color: #0EA26380 !important;
        opacity: 1 !important;
      }
      .actual-dates-bar {
        position: absolute;
        top: 2px;
        height: calc(100% - 4px);
        background: rgba(255, 77, 79, 0.3);
        border: 2px solid #ff4d4f;
        border-radius: 2px;
        z-index: 1;
        pointer-events: none;
      }
      .actual-dates-bar::before {
        content: 'Actual';
        position: absolute;
        top: -18px;
        left: 2px;
        font-size: 10px;
        color: #ff4d4f;
        font-weight: bold;
        white-space: nowrap;
      }
      .planned-dates-bar {
        position: absolute;
        bottom: -8px;
        height: 4px;
        background: #595959;
        border-radius: 2px;
        z-index: 0;
        pointer-events: none;
      }
      .planned-dates-bar::before {
        content: 'Baseline';
        position: absolute;
        top: -15px;
        left: 2px;
        font-size: 10px;
        color: #595959;
        font-weight: bold;
        white-space: nowrap;
      }
      .actual-extension {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        height: 3px;
        background: repeating-linear-gradient(
          to right,
          #ff4d4f 0px,
          #ff4d4f 6px,
          transparent 6px,
          transparent 12px
        );
        z-index: 10;
        pointer-events: none;
      }
      .actual-extension.early-start {
        right: 100%;
      }
      .actual-extension.late-finish {
        left: 100%;
      }
      .no-timeline-bar {
        display: none !important;
      }
      .columns-modal .ant-modal-content,
      .columns-modal .ant-modal-header,
      .columns-modal .ant-modal-body,
      .columns-modal .ant-modal-footer {
        background: #ffffff !important;
      }
      .columns-modal .ant-modal-content {
        border-radius: 10px !important;
        border: 1px solid #f0f0f0 !important;
        box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
      }
      .columns-modal .ant-modal-title {
        color: #1677ff !important;
        font-weight: 700 !important;
      }
      .columns-modal .ant-modal-footer { border-top: 1px solid #f0f0f0 !important; }
      .columns-modal .columns-count-badge {
        margin-left: 8px;
        background: #f0f5ff;
        color: #2f54eb;
        border: 1px solid #adc6ff;
        padding: 2px 8px;
        border-radius: 999px;
        font-weight: 600;
      }
      .columns-modal .columns-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px 16px;
      }
      .columns-modal .columns-grid .ant-checkbox-wrapper {
        background: #ffffff;
        border: 1px solid #f0f0f0;
        border-radius: 8px;
        padding: 10px 12px;
      }
      /* Hide built-in link control bubble (type selector/delete) */
      .gantt_link_controls { display: none !important; }
      .gantt_grid, .gantt_chart {
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
  
  .gantt_grid_data .gantt_cell,
  .gantt_grid_scale .gantt_grid_head_cell {
    border: 1px solid #d9d9d9 !important;
  }
    .gantt_grid_data .gantt_row_project {
    background-color: #ffcccc !important; /* Light red for projects */
  }
  
  .gantt_grid_data .gantt_row_wbs {
    background-color: #cce7ff !important; /* Light blue for WBS */
  }
  
  .gantt_grid_data .gantt_row_subwbs {
    background-color: #d9f7be !important; /* Light green for Sub-WBS */
  }
  
  .gantt_grid_data .gantt_row_activity {
    background-color: #ffffff !important; /* White for activities (default) */
  }

  /* Hover effects to maintain usability */
  /* Brighten on hover */
.gantt_grid_data .gantt_row_project:hover,
.gantt_grid_data .gantt_row_wbs:hover,
.gantt_grid_data .gantt_row_subwbs:hover,
.gantt_grid_data .gantt_row_activity:hover {
    filter: brightness(95%); 
}

   /* Add this to the existing style.textContent */
.gantt_grid_data .gantt_row.gantt_selected,
.gantt_task_row.gantt_selected,
.gantt_selected .gantt_cell {
    filter: brightness(95%); 
}

.delete-link-modal .ant-modal-content,
.delete-link-modal .ant-modal-header,
.delete-link-modal .ant-modal-body,
.delete-link-modal .ant-modal-footer {
  background: #ffffff !important;
}
.delete-link-modal .ant-modal-content {
  border-radius: 10px !important;
  border: 1px solid #f0f0f0 !important;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
}
.delete-link-modal .ant-modal-title {
  color: #ff4d4f !important;
  font-weight: 700 !important;
}
.delete-link-modal .ant-modal-footer {
  border-top: 1px solid #f0f0f0 !important;
}
.delete-link-modal .ant-modal-body {
  font-size: 14px !important;
  color: #595959 !important;
}

  
    `;
    document.head.appendChild(style);

    gantt.templates.task_class = function (start, end, task) {
      let classes = [];
      if (task.type === "project") {
        classes.push("gantt_project");
      } else if (task.type === "milestone") {
        classes.push("gantt_milestone");
      }
      const status = (task.status || "Planned").toLowerCase().replace(/\s+/g, "_");
      classes.push(`status_${status}`);
      if (isVisualizationOpen && task.type !== "activity") {
        classes.push("no-timeline-bar");
      }
      return classes.join(" ");
    };

    // Add this new template function
gantt.templates.grid_row_class = function(start, end, task) {
  let classes = [];
  
  // Add row class based on task type
  if (task.type === "project") {
    classes.push("gantt_row_project");
  } else if (task.type === "wbs") {
    classes.push("gantt_row_wbs");
  } else if (task.type === "subwbs") {
    classes.push("gantt_row_subwbs");
  } else if (task.type === "activity") {
    classes.push("gantt_row_activity");
  }
  
  return classes.join(" ");
};

    gantt.templates.task_text = function(start, end, task) {
      return `${Math.round((task?.progress || 0) * 100)}% <span style="margin-left: 10px">${task.text}</span>`;
    };

    gantt.attachEvent("onTaskLoading", function(task) {
      if (!task.status) {
        task.status = "Planned";
      }
      return true;
    });

    gantt.attachEvent("onAfterTaskRender", function(task_id, task) {
      const taskElement = gantt.getTaskNode(task_id);
      if (!taskElement) return;

      taskElement.querySelectorAll('.actual-dates-bar, .planned-dates-bar, .actual-extension').forEach(el => el.remove());

      if (task.type !== "activity") return; // Skip rendering bars for projects and WBS

      const plannedStart = new Date(task.start_date);
      const plannedEnd = new Date(task.end_date);
      const plannedStartPos = gantt.posFromDate(plannedStart);
      const plannedEndPos = gantt.posFromDate(plannedEnd);
      const plannedWidth = plannedEndPos - plannedStartPos;

      const plannedBar = document.createElement('div');
      plannedBar.className = 'planned-dates-bar';
      plannedBar.style.width = `${plannedWidth}px`;
      plannedBar.style.left = `0px`;
      plannedBar.style.bottom = '-8px';
      plannedBar.style.height = '4px';
      plannedBar.style.background = '#595959';
      plannedBar.title = `Baseline: ${plannedStart.toLocaleDateString()} - ${plannedEnd.toLocaleDateString()}`;
      plannedBar.style.position = 'absolute';
      plannedBar.style.zIndex = '0';
      taskElement.appendChild(plannedBar);

      if (task.actualStart || task.actualFinish) {
        const actualStart = task.actualStart ? new Date(task.actualStart) : plannedStart;
        const actualEnd = task.actualFinish ? new Date(task.actualFinish) : plannedEnd;
        const actualStartPos = gantt.posFromDate(actualStart);
        const actualEndPos = gantt.posFromDate(actualEnd);
        const actualWidth = actualEndPos - actualStartPos;
        const actualOffset = actualStartPos - plannedStartPos;

        const actualBar = document.createElement('div');
        actualBar.className = 'actual-dates-bar';
        actualBar.style.width = `${actualWidth}px`;
        actualBar.style.left = `${actualOffset}px`;
        actualBar.style.top = '2px';
        actualBar.style.height = 'calc(100% - 10px)';
        actualBar.style.background = 'rgba(255,77,79,0.7)';
        actualBar.style.border = '2px solid #ff4d4f';
        actualBar.style.zIndex = '2';
        actualBar.style.position = 'absolute';
        actualBar.title = `Actual: ${actualStart ? actualStart.toLocaleDateString() : '—'} - ${actualEnd ? actualEnd.toLocaleDateString() : '—'}`;
        taskElement.appendChild(actualBar);

        if (task.actualStart && new Date(task.actualStart) < plannedStart) {
          const earlyWidth = plannedStartPos - gantt.posFromDate(new Date(task.actualStart));
          const earlyExt = document.createElement('div');
          earlyExt.className = 'actual-extension early-start';
          earlyExt.style.width = `${earlyWidth}px`;
          earlyExt.style.left = `${gantt.posFromDate(new Date(task.actualStart)) - plannedStartPos}px`;
          earlyExt.style.top = '50%';
          earlyExt.style.height = '3px';
          earlyExt.style.background = 'repeating-linear-gradient(to right,#ff4d4f 0px,#ff4d4f 6px,transparent 6px,transparent 12px)';
          earlyExt.style.position = 'absolute';
          earlyExt.style.zIndex = '10';
          earlyExt.title = `Early Start: ${new Date(task.actualStart).toLocaleDateString()}`;
          taskElement.appendChild(earlyExt);
        }

        if (task.actualFinish && new Date(task.actualFinish) > plannedEnd) {
          const lateWidth = gantt.posFromDate(new Date(task.actualFinish)) - plannedEndPos;
          const lateExt = document.createElement('div');
          lateExt.className = 'actual-extension late-finish';
          lateExt.style.width = `${lateWidth}px`;
          lateExt.style.left = `${plannedEndPos - plannedStartPos}px`;
          lateExt.style.top = '50%';
          lateExt.style.height = '3px';
          lateExt.style.background = 'repeating-linear-gradient(to right,#ff4d4f 0px,#ff4d4f 6px,transparent 6px,transparent 12px)';
          lateExt.style.position = 'absolute';
          lateExt.style.zIndex = '10';
          lateExt.title = `Late Finish: ${new Date(task.actualFinish).toLocaleDateString()}`;
          taskElement.appendChild(lateExt);
        }
      }

      taskElement.style.position = 'relative';
    });

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

    // Disable link line click/double-click actions (prevent native menu)
    gantt.attachEvent("onLinkClick", () => false);
    gantt.attachEvent("onLinkDblClick", (id) => {
  setSelectedLinkId(id);
  // setIsDeleteLinkModalVisible(true);
  return false;
});

    gantt.attachEvent("onAfterTaskUpdate", (id, task) => {
      if (isInitializedRef.current && task.text && task.text.trim() !== "") {
        debouncedAutoSave();
      }
    });

    gantt.attachEvent("onAfterTaskDrag", (id, mode, e) => {
      if (isInitializedRef.current) {
        debouncedAutoSave();
      }
    });

    gantt.attachEvent("onAfterLinkAdd", () => {
      if (isInitializedRef.current) {
        syncTasksFromCurrentLinks();
        debouncedAutoSave();
      }
    });

    gantt.attachEvent("onAfterLinkUpdate", () => {
      if (isInitializedRef.current) {
        syncTasksFromCurrentLinks();
        debouncedAutoSave();
      }
    });

    gantt.attachEvent("onAfterLinkDelete", () => {
      if (isInitializedRef.current) {
        syncTasksFromCurrentLinks();
        debouncedAutoSave();
      }
    });

    gantt.init(ganttContainer.current);

    const resizeObserver = new ResizeObserver((entries) => {
      if (isInitializedRef.current && isVisualizationOpen) {
        const containerWidth = entries[0].contentRect.width;
        gantt.config.grid_width = Math.floor(containerWidth * 0.5);
        gantt.render();
        gantt.setSizes();
      }
    });

    if (ganttContainer.current) {
      resizeObserver.observe(ganttContainer.current);
    }

    window.addEventListener("resize", () => {
      gantt.render();
      gantt.setSizes();
    });

    loadFromServer().then(() => {
      isInitializedRef.current = true;
    });

    return () => {
      gantt.clearAll();
      isInitializedRef.current = false;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      const existingStyle = document.querySelector('style[data-gantt-custom]');
      if (existingStyle) {
        existingStyle.remove();
      }
      resizeObserver.disconnect();
    };
  }, [selectedCols, isVisualizationOpen,activeTab]);

  useEffect(() => {
    if (isInitializedRef.current) {
      checkAndAutoUpdateTaskStatuses();
    }
  }, [allTasks, isInitializedRef.current, checkAndAutoUpdateTaskStatuses]);

  useEffect(() => {
    updateGanttLayout();
  }, [isVisualizationOpen, updateGanttLayout]);

  const loadFromServer = async () => {
    try {
      setIsSaving(true);
      const tasksRes = await axios.get(`${backend_url}/charts/${userId}/${project._id}`);
      const tasks = tasksRes.data.tasks.map((t) => ({
  ...t,
  start_date: new Date(t.start),
  end_date: new Date(t.end),
  originalDuration: t.duration,
  duration: t.duration, // Use the duration from backend
  progress: t.progress || 0,
  actualStart: t.actualStart ? new Date(t.actualStart) : null,
  actualFinish: t.actualFinish ? new Date(t.actualFinish) : null,
  totalFloat: t.totalFloat || 0,
  activityType: t.activityType || "",
  status: t.status || "Planned",
  predecessor: t.predecessor || [],
  successors: t.successors || [],
}));
      setAllTasks(tasks);
      const links = tasks.reduce((acc, task) => {
        const taskLinks = [];
        (task.predecessor || []).forEach((pred) => {
          taskLinks.push({
            id: `link_pred_${task.id}_${pred.taskId}`,
            source: pred.taskId,
            target: task.id,
            type: reverseLinkTypeMap[pred.relation] || 1,
          });
        });
        (task.successors || []).forEach((succ) => {
          taskLinks.push({
            id: `link_succ_${task.id}_${succ.taskId}`,
            source: task.id,
            target: succ.taskId,
            type: reverseLinkTypeMap[succ.relation] || 1,
          });
        });
        return [...acc, ...taskLinks];
      }, []);
      gantt.clearAll();
      await saveToServer();
      gantt.parse({ data: tasks, links });
        gantt.eachTask((task) => {
  if (activeTab === "projects") {
    gantt.close(task.id); // All tasks closed by default in Projects tab
  } else if (activeTab === "wbs") {
    if (task.type === "project") {
      gantt.open(task.id); // Projects open in WBS tab
    } else {
      gantt.close(task.id); // WBS and activities closed
    }
  } else if (activeTab === "activities") {
    gantt.open(task.id); // All open in Activities tab
  }
});
      if (tasks.length > 0) {
        const firstTask = tasks[0];
        const taskStartDate = new Date(firstTask.start_date);
        const currentYear = new Date().getFullYear();
        if (taskStartDate.getFullYear() > currentYear + 10) {
          console.warn("Task date seems too far in the future:", taskStartDate);
        }
        gantt.showDate(taskStartDate);
        setTimeout(() => {
          gantt.setSizes();
          gantt.render();
        }, 50);
      }
      setTimeout(() => {
        gantt.setSizes();
        gantt.render();
      }, 100);
      // Save once to normalize any server-side remnants without touching a separate links API
      await saveToServer();
    } catch (err) {
      console.error("Load error:", err);
      message.error("Load failure: " + (err?.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  // Generate hierarchical ID based on parent and siblings
const generateHierarchicalId = (parentId, taskType) => {
  if (taskType === "project") {
    // For projects, find the next project number
    const projectTasks = allTasks.filter(t => t.type === "project");
    return `${projectTasks.length + 1}`;
  }
  
  if (!parentId) return "1";
  
  try {
    const parentTask = gantt.getTask(parentId);
    const parentWbsId = parentTask.taskId || "1";
    const siblings = gantt.getChildren(parentId);
    const siblingCount = siblings.filter(id => {
      const sibling = gantt.getTask(id);
      return sibling.type === taskType;
    }).length;
    
    return `${parentWbsId}.${siblingCount + 1}`;
  } catch (error) {
    return "1.1";
  }
};

// Get next sequence number for same type under same parent
const getNextSequenceNumber = (parentId, taskType) => {
  if (!parentId && taskType === "project") {
    const projectCount = allTasks.filter(t => t.type === "project").length;
    return projectCount + 1;
  }
  
  if (!parentId) return 1;
  
  try {
    const siblings = gantt.getChildren(parentId);
    const sameTypeSiblings = siblings.filter(id => {
      try {
        const sibling = gantt.getTask(id);
        return sibling.type === taskType;
      } catch {
        return false;
      }
    });
    return sameTypeSiblings.length + 1;
  } catch {
    return 1;
  }
};

  const handleAddProject = async () => {
    const projectNumber = getNextSequenceNumber(null, "project");
  const hierarchicalId = `${projectNumber}`;
    const newProject = {
      id: `project_${Date.now()}`,
      taskId: hierarchicalId,
      text: "New Project",
      start_date: new Date(),
      end_date: dayjs().add(30, "day").toDate(),
      duration: 30,
      type: "project",
      progress: 0,
      parent: 0,
      status: "Planned",
      predecessor: [],
      successors: [],
    };
    try {
      gantt.addTask(newProject);
      setAllTasks((prev) => [...prev, newProject]);
      await saveToServer();
      if (onTasksChange) {
  onTasksChange();
}
      message.success("Project added successfully");
    } catch (err) {
      message.error("Failed to add Project: " + (err?.message || "Unknown error"));
      gantt.deleteTask(newProject.id);
    }
  };

  const handleAddWBS = async () => {
    const selectedId = gantt.getSelectedId();
    if (!selectedId) {
      message.warning("Please select a Project to add WBS");
      return;
    }
    const selectedTask = gantt.getTask(selectedId);
    if (selectedTask.type !== "project" || !selectedTask.text || selectedTask.text.trim() === "" || selectedTask.id.toString().startsWith("empty_")) {
      message.warning("Please select a valid Project");
      return;
    }
    const hierarchicalId = generateHierarchicalId(selectedId, "wbs");
    const wbsTask = {
      id: `wbs_${Date.now()}`,
      taskId: hierarchicalId,
      text: "New WBS",
      start_date: new Date(),
      end_date: dayjs().add(30, "day").toDate(),
      duration: 30,
      type: "wbs",
      progress: 0,
      parent: selectedId,
      status: "Planned",
      predecessor: [],
      successors: [],
    };
    try {
      gantt.open(selectedId);
      gantt.addTask(wbsTask);
      setAllTasks((prev) => [...prev, wbsTask]);
      await saveToServer();
      message.success("WBS added successfully");
    } catch (err) {
      message.error("Failed to add WBS: " + (err?.message || "Unknown error"));
      gantt.deleteTask(wbsTask.id);
    }
  };
  const handleAddSubWBS = async () => {
  const selectedId = gantt.getSelectedId();
  if (!selectedId) {
    message.warning("Please select a WBS to add Sub-WBS");
    return;
  }
  const selectedTask = gantt.getTask(selectedId);
  if (selectedTask.type !== "wbs" || !selectedTask.text || selectedTask.text.trim() === "" || selectedTask.id.toString().startsWith("empty_")) {
    message.warning("Please select a valid WBS");
    return;
  }
  const hierarchicalId = generateHierarchicalId(selectedId, "subwbs");
  const subWbsTask = {
    id: `subwbs_${Date.now()}`,
    taskId: hierarchicalId,
    text: "New Sub-WBS",
    start_date: new Date(),
    end_date: dayjs().add(30, "day").toDate(),
    duration: 30,
    type: "subwbs",
    progress: 0,
    parent: selectedId,
    status: "Planned",
    predecessor: [],
    successors: [],
  };
  try {
    gantt.open(selectedId);
    gantt.addTask(subWbsTask);
    setAllTasks((prev) => [...prev, subWbsTask]);
    await saveToServer();
    message.success("Sub-WBS added successfully");
  } catch (err) {
    message.error("Failed to add Sub-WBS: " + (err?.message || "Unknown error"));
    gantt.deleteTask(subWbsTask.id);
  }
};

  const handleAddActivity = async () => {
    const selectedId = gantt.getSelectedId();
    if (!selectedId) {
      message.warning("Please select a WBS or Sub-WBS to add Activity");
      return;
    }
    const selectedTask = gantt.getTask(selectedId);
    if ((selectedTask.type !== "wbs" && selectedTask.type !== "subwbs")  || !selectedTask.text || selectedTask.text.trim() === "" || selectedTask.id.toString().startsWith("empty_")) {
      message.warning("Please select a valid WBS or Sub-WBS");
      return;
    }
    const hierarchicalId = generateHierarchicalId(selectedId, "activity");
    const activityTask = {
      id: `activity_${Date.now()}`,
      taskId: hierarchicalId,
      text: "New Activity",
      start_date: new Date(),
      end_date: dayjs().add(30, "day").toDate(),
      duration: 30,
      type: "activity",
      progress: 0,
      parent: selectedId,
      status: "Planned",
      predecessor: [],
      successors: [],
    };
    try {
      gantt.open(selectedId);
      gantt.addTask(activityTask);
      setAllTasks((prev) => [...prev, activityTask]);
      await saveToServer();
      message.success("Activity added successfully");
    } catch (err) {
      message.error("Failed to add Activity: " + (err?.message || "Unknown error"));
      gantt.deleteTask(activityTask.id);
    }
  };

  const handleDeleteTask = async () => {
    const selectedId = gantt.getSelectedId();
    if (!selectedId) {
      message.warning("Please select a task to delete");
      return;
    }
    const task = gantt.getTask(selectedId);
    if (!task || !task.text || task.text.trim() === "") {
      message.warning("Invalid task selected");
      return;
    }
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      await axios.delete(
        `${backend_url}/charts/${userId}/${project._id}/${selectedId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const children = gantt.getChildren(selectedId);
      children.forEach(childId => gantt.deleteTask(childId));
      gantt.deleteTask(selectedId);
      setAllTasks(prev => prev.filter(t => t.id !== selectedId && !children.includes(t.id)));
      await saveToServer();
      if (onTasksChange) {
  onTasksChange();
}
      message.success("Task deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      if (err.response?.status === 401) {
        message.error("Unauthorized: Please log in again");
      } else {
        message.error("Failed to delete task: " + (err?.message || "Unknown error"));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const openModal = (id) => {
    const t = gantt.getTask(id);
    setModalTask(t);
    originalModalTaskDatesRef.current = {
      start: t.start_date ? dayjs(t.start_date) : null,
      end: t.end_date ? dayjs(t.end_date) : null,
    };
    form.setFieldsValue({
      taskId: t.taskId,
      text: t.text,
      start: [dayjs(t.start_date), dayjs(t.end_date)],
      type: t.type,
      progress: Math.round((t.progress || 0) * 100),
      actualStart: t.actualStart && t.actualFinish
        ? [dayjs(t.actualStart), dayjs(t.actualFinish)]
        : [t.actualStart ? dayjs(t.actualStart) : null, null],
      totalFloat: t.totalFloat || 0,
      activityType: t.activityType || "",
      status: t.status || "Planned",
      predecessor: (t.predecessor || []).map((p) => ({
        taskId: p.taskId, // internal immutable id
        relation: p.relation,
      })),
      successors: (t.successors || []).map((s) => ({
        taskId: s.taskId, // internal immutable id
        relation: s.relation,
      })),
    });
    setIsModalVisible(true);
  };

  const onModalSave = async () => {
    try {
      if (!modalTask) {
        throw new Error("No task selected for editing");
      }
      const vals = await form.validateFields();
  
        const predecessors = Array.from(
  new Map(
    (vals.predecessor || []).map((p) => [`${p.taskId}-${p.relation}`, p])
  ).values()
).filter((p) => allTasks.some((t) => t.id === p.taskId));

const successors = Array.from(
  new Map(
    (vals.successors || []).map((s) => [`${s.taskId}-${s.relation}`, s])
  ).values()
).filter((s) => allTasks.some((t) => t.id === s.taskId));
      const newStart = vals.start && vals.start[0] && dayjs.isDayjs(vals.start[0]) ? vals.start[0] : null;
      const newEnd = vals.start && vals.start[1] && dayjs.isDayjs(vals.start[1]) ? vals.start[1] : null;
      const actualStart = vals.actualStart && vals.actualStart[0] && dayjs.isDayjs(vals.actualStart[0]) ? vals.actualStart[0] : null;
      const actualFinish = vals.actualStart && vals.actualStart[1] && dayjs.isDayjs(vals.actualStart[1]) ? vals.actualStart[1] : null;
      const originalStart = originalModalTaskDatesRef.current.start && dayjs.isDayjs(originalModalTaskDatesRef.current.start)
        ? originalModalTaskDatesRef.current.start
        : null;
      const originalEnd = originalModalTaskDatesRef.current.end && dayjs.isDayjs(originalModalTaskDatesRef.current.end)
        ? originalModalTaskDatesRef.current.end
        : null;
      const datesChanged =
        (newStart && originalStart && !newStart.isSame(originalStart, "day")) ||
        (newEnd && originalEnd && !newEnd.isSame(originalEnd, "day")) ||
        (!newStart && originalStart) ||
        (!newEnd && originalEnd);
      const actualDuration = actualStart && actualFinish
        ? Math.ceil(actualFinish.diff(actualStart, "day"))
        : null;
      const updatedTaskData = {
        taskId: vals.taskId,
        text: vals.text,
        type: modalTask.type,
        progress: (vals.progress || 0) / 100,
        actualDuration: actualDuration,
        actualStart: actualStart ? actualStart.toDate() : null,
        actualFinish: actualFinish ? actualFinish.toDate() : null,
        totalFloat: vals.totalFloat || 0,
        activityType: vals.activityType || "",
        status: vals.status || "Planned",
        predecessor: predecessors,
        successors: successors,
        duration: modalTask.duration || 1
      };
      if (datesChanged) {
        updatedTaskData.start_date = newStart ? newStart.toDate() : null;
        updatedTaskData.end_date = newEnd ? newEnd.toDate() : null;
        
      } else {
        delete updatedTaskData.start_date;
        delete updatedTaskData.end_date;
      }
      Object.assign(modalTask, updatedTaskData);
      let updatedTasks = allTasks.map((task) =>
        task.id === modalTask.id ? { ...modalTask } : task
      );
      // if (!datesChanged) {
      //   const taskMap = new Map(updatedTasks.map(t => [t.id, { ...t }]));
      //   const scheduleTask = (taskId, visited = new Set()) => {
      //     if (visited.has(taskId)) return;
      //     visited.add(taskId);
      //     const task = taskMap.get(taskId);
      //     if (!task) return;
      //     const preds = predecessors.filter(p => p.taskId === taskId).length
      //       ? predecessors
      //       : (task.predecessor || []);
      //     let latestFinish = null;
      //     preds.forEach(pred => {
      //       const predTask = taskMap.get(pred.taskId);
      //       if (predTask && predTask.end_date) {
      //         const predFinish = dayjs(predTask.end_date);
      //         if (!latestFinish || predFinish.isAfter(latestFinish)) {
      //           latestFinish = predFinish;
      //         }
      //       }
      //     });
      //     if (latestFinish) {
      //       task.start_date = latestFinish.add(1, "day").toDate();
      //       task.end_date = dayjs(task.start_date).add(task.duration - 1, "day").toDate();
      //     }
      //     (task.successors || []).forEach(succ => scheduleTask(succ.taskId, visited));
      //   };
      //   scheduleTask(modalTask.id);
      //   updatedTasks = Array.from(taskMap.values());
      // }
      if (!datesChanged) {
  // Only reschedule if dates weren't manually changed
  updatedTasks = updatedTasks.map(task => {
    if (task.id === modalTask.id) {
      return { ...modalTask };
    }
    return task;
  });
}
      setAllTasks(updatedTasks);
      const currentLinks = gantt.getLinks().filter((l) => l.source !== modalTask.id && l.target !== modalTask.id);
      const newLinks = [];
      predecessors.forEach((p) => {
        newLinks.push({
          id: `link_pred_${modalTask.id}_${p.taskId}`,
          source: p.taskId,
          target: modalTask.id,
          type: reverseLinkTypeMap[p.relation] || 1,
        });
      });
      successors.forEach((s) => {
        newLinks.push({
          id: `link_succ_${modalTask.id}_${s.taskId}`,
          source: modalTask.id,
          target: s.taskId,
          type: reverseLinkTypeMap[s.relation] || 1,
        });
      });
      gantt.clearAll();
      gantt.parse({
        data: updatedTasks.map((task) => ({
          ...task,
          start_date: task.start_date ? new Date(task.start_date) : null,
          end_date: task.end_date ? new Date(task.end_date) : null,
          actualStart: task.actualStart ? new Date(task.actualStart) : null,
          actualFinish: task.actualFinish ? new Date(task.actualFinish) : null,
        })),
        links: [...currentLinks, ...newLinks],
      });
      if (!gantt.getTask(modalTask.id)) {
        throw new Error(`Task with id ${modalTask.id} not found in Gantt chart`);
      }
      gantt.updateTask(modalTask.id);
gantt.render();
// syncTasksFromCurrentLinks();
      setIsModalVisible(false);
await saveToServer();
message.success("Task updated successfully");
    } catch (error) {
      console.error("Modal save error:", error);
      message.error("Failed to update task: " + (error.message || "Unknown error"));
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
        sourceText: sourceTask.taskId,
        targetText: targetTask.taskId,
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
            sourceText: sourceTask.taskId,
            targetText: targetTask.taskId,
            type: l.type,
            typeLabel: typeLabels[l.type] || "Unknown",
          };
        });
        setTaskLinks(linksData);
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
      const allLinks = gantt.getLinks();
      const selectedId = gantt.getSelectedId();
      const taskRelatedLinks = allLinks.filter(l =>
        l.source === selectedId || l.target === selectedId
      );
      const linksData = taskRelatedLinks.map((l, index) => {
        const sourceTask = gantt.getTask(l.source);
        const targetTask = gantt.getTask(l.target);
        const typeLabels = ["Start-to-Start", "End-to-Start", "End-to-End", "Start-to-End"];
        return {
          key: index,
          id: l.id,
          source: l.source,
          target: l.target,
          sourceText: sourceTask.taskId,
          targetText: targetTask.taskId,
          type: l.type,
          typeLabel: typeLabels[l.type] || "Unknown",
        };
      });
      setTaskLinks(linksData);
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
    gantt.config.min_column_width = config.min_column_width;
    
    // Reset template first
    gantt.templates.date_scale = null;
    
    if (level === 'week') {
      gantt.config.date_scale = "%d %M";
      gantt.templates.date_scale = function(date) {
        const d = new Date(date);
        const startOfWeek = new Date(d);
        startOfWeek.setDate(d.getDate() - d.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        const startDay = startOfWeek.getDate();
        const endDay = endOfWeek.getDate();
        const startMonth = startOfWeek.toLocaleDateString('en', {month: 'short'});
        const endMonth = endOfWeek.toLocaleDateString('en', {month: 'short'});
        if (startMonth === endMonth) {
          return `${startMonth} ${startDay}-${endDay}`;
        } else {
          return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
        }
      };
    } else if (level === 'quarter') {
      gantt.config.date_scale = "%F %Y";
      gantt.templates.date_scale = function(date) {
        const d = new Date(date);
        const quarter = Math.floor(d.getMonth() / 3) + 1;
        const year = d.getFullYear();
        
        const quarterMonths = {
          1: 'Jan - Mar',
          2: 'Apr - Jun', 
          3: 'Jul - Sep',
          4: 'Oct - Dec'
        };
        
        return `${quarterMonths[quarter]} ${year}`;
      };
    } else {
      gantt.config.date_scale = config.format;
      // Template already reset to null above
    }
    
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

  const relationshipColumns = [
    {
      title: 'Task',
      dataIndex: 'taskId',
      key: 'taskId',
      render: (value, record) => {
  const t = allTasks.find((x) => x.id === value);
  const display = t ? `${t.taskId} - ${t.text}` : value;
  return (
    <span title={display} style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
      {display}
    </span>
  );
},
    },
    {
      title: 'Relationship',
      dataIndex: 'relation',
      key: 'relation',
      render: (relation, record) => (
        <Select
          value={relation}
          onChange={(value) => {
            form.setFieldsValue({
              [record.type]: form.getFieldValue(record.type).map((item) =>
                item.taskId === record.taskId ? { ...item, relation: value } : item
              ),
            });
          }}
          style={{ width: 150 }}
        >
          <Select.Option value="FS">Finish-to-Start</Select.Option>
          <Select.Option value="SS">Start-to-Start</Select.Option>
          <Select.Option value="FF">Finish-to-Finish</Select.Option>
          <Select.Option value="SF">Start-to-Finish</Select.Option>
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
          onClick={() => {
            form.setFieldsValue({
              [record.type]: form.getFieldValue(record.type).filter((item) => item.taskId !== record.taskId),
            });
          }}
        >
          Delete
        </Button>
      ),
    },
  ];
const exportToPDF = async () => {
  try {
    setIsSaving(true);
    message.info("Generating PDF...");

    const pdf = new jsPDF('l', 'mm', 'a4'); // landscape orientation
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const headerHeight = 25;
    const footerHeight = 20;
    
    // Get the main gantt container element
    const ganttElement = ganttContainer.current;
    if (!ganttElement) {
      throw new Error("Gantt container not found");
    }

    // Add header
    const companyName = project?.userId?.organizationName || "Carey Ray Trading";
    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.text(companyName, margin, margin + 10);
    pdf.setLineWidth(0.5);
    pdf.line(margin, margin + 15, pageWidth - margin, margin + 15);

    // Add footer
    const footerY = pageHeight - footerHeight;
    pdf.setLineWidth(0.5);
    pdf.line(margin, footerY, pageWidth - margin, footerY);
    
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text('Powered by: ', pageWidth - 60, footerY + 15);
    
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(41, 128, 185);
    pdf.text('Schesti', pageWidth - 35, footerY + 15);
    
    pdf.setFontSize(8);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text('Page 1 of 1', margin, footerY + 15);

    // Calculate available content area
    const contentStartY = margin + headerHeight;
    const contentHeight = pageHeight - headerHeight - footerHeight - (margin * 2);
    
    // Take screenshot of current gantt view
    const canvas = await html2canvas(ganttElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: ganttElement.clientWidth,
      height: ganttElement.clientHeight,
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = pageWidth - (margin * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add image (scale down if too large)
    const finalImgHeight = Math.min(imgHeight, contentHeight);
    pdf.addImage(imgData, 'PNG', margin, contentStartY, imgWidth, finalImgHeight);
    
    // Save the PDF
    const fileName = `${project.name || 'gantt-chart'}-${dayjs().format('YYYY-MM-DD-HH-mm')}.pdf`;
    pdf.save(fileName);
    
    message.success("PDF exported successfully");
  } catch (error) {
    console.error("PDF export error:", error);
    message.error("Failed to export PDF: " + (error.message || "Unknown error"));
  } finally {
    setIsSaving(false);
  }
};

  return (
    <div className="relative w-full h-full">

<Card
  style={{
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    marginBottom: 16,
    flexShrink: 0,
    borderRadius: 8,
    border: '1px solid #e6f4ff',
    // background: 'linear-gradient(180deg, #ffffff 0%, #f6fbff 100%)',
    background: '#ffff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  }}
>
  <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 0, padding: '0 0px', margin: '0 0px'}}>
    <Space wrap={false} size={4} style={{ padding: 0 }}>
      {activeTab === "projects" && (
        <Button
          icon={<PlusOutlined />}
          onClick={handleAddProject}
          type="primary"
        >
          Add Project
        </Button>
      )}
      {activeTab === "wbs" && (
        <>
        <Button
          icon={<PlusOutlined />}
          onClick={handleAddWBS}
          type="primary"
        >
          Add WBS
        </Button>
        <Button
      icon={<PlusOutlined />}
      onClick={handleAddSubWBS}
      type="primary"
    >
      Add Sub-WBS
    </Button>
    </>
      )}
      {activeTab === "activities" && (
        <Button
          icon={<PlusOutlined />}
          onClick={handleAddActivity}
          type="primary"
          style={{ width: "40px !important" }}
        >
          Add Activity
        </Button>
      )}
      <Button icon={<ArrowUpOutlined />} onClick={() => move(-1)} disabled={isSaving}>
        Up
      </Button>
      <Button icon={<ArrowDownOutlined />} onClick={() => move(1)} disabled={isSaving}>
        Down
      </Button>
      <Button icon={<DeleteOutlined />} onClick={handleDeleteTask} disabled={isSaving}>
        Delete
      </Button>
      <Button icon={<ZoomInOutlined />} onClick={zoomIn} disabled={zoomLevel === "hour"}>
        Zoom In
      </Button>
      <Button icon={<ZoomOutOutlined />} onClick={zoomOut} disabled={zoomLevel === "year"}>
        Zoom Out
      </Button>
      <Button
        icon={<DownloadOutlined />}
        onClick={exportToPDF}
        disabled={isSaving}
      >
        Export PDF
      </Button>
      <Button
        icon={<EyeOutlined />}
        onClick={openColumnsModal}
      >
        Columns
      </Button>
      {activeTab === 'activities' && (
        <Button
          icon={isVisualizationOpen ? <LeftOutlined /> : <RightOutlined />}
          onClick={onToggleVisualization}
          type={isVisualizationOpen ? 'default' : 'primary'}
        >
          {isVisualizationOpen ? 'Hide Timeline' : 'Show Timeline'}
        </Button>
      )}
      {isSaving && (
        <span style={{ color: '#1890ff', fontSize: '12px' }}>
          Saving...
        </span>
      )}
    </Space>
  </div>
</Card>
      <div
        className="w-full"
        style={{ height: "calc(100% - 80px)" }}
      >
        <div
          ref={ganttContainer}
          style={{
            width: "100%",
            height: "100%",
            border: "1px solid #d9d9d9",
            borderRadius: "6px",
            overflow: "hidden",
            position: "relative",
          }}
          className="gantt-container"
        />
      </div>
      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={onModalSave}
        width={800}
        style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '24px',
          top: 20,
        }}
      >
        <h4 style={{ color: '#1890ff', fontWeight: 'bold' }}>Edit Task</h4>
        <Form form={form} layout="vertical">
          <Form.Item name="taskId" label="Task ID" rules={[{ required: true, message: 'Please enter Task ID' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="text" label="Name" rules={[{ required: true, message: 'Please enter task name' }]}>
            <Input placeholder="Enter task name" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="start" label="Start - End Date" rules={[{ required: true, message: 'Please select start and end dates' }]}>
  <DatePicker.RangePicker 
    style={{ width: "100%" }} 
    onChange={null }
  />
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
              <Form.Item name="type" label="Type" >
                <Select placeholder="Select type" disabled>
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
            <Col span={12}>
              <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select status' }]}>
                <Select placeholder="Select status">
                  <Select.Option value="Planned">Planned</Select.Option>
                  <Select.Option value="In Progress">In Progress</Select.Option>
                  <Select.Option value="Completed">Completed</Select.Option>
                </Select>
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
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Predecessors">
                <Form.List name="predecessor">
                  {(fields, { add, remove }) => (
                    <>
                      <Table
                        dataSource={fields.map((field, index) => ({
                          key: field.key,
                          taskId: form.getFieldValue(['predecessor', index, 'taskId']),
                          relation: form.getFieldValue(['predecessor', index, 'relation']),
                          type: 'predecessor',
                        }))}
                        columns={relationshipColumns}
                        pagination={false}
                        size="small"
                      />
                      <Form form={predecessorForm} layout="inline" style={{ marginTop: "24px" }}>
                        <Row gutter={8}>
                          <Col span={12}>
                            <Form.Item name="taskId" label="Task">
                              <Select
                                placeholder="Select predecessor task"
                                options={allTasks
                                  .filter((task) => task.id !== modalTask?.id && task.type === "activity")
                                  .map((task) => ({
                                    value: task.id,
                                    label: `${task.taskId} - ${task.text}`,
                                  }))}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item name="relation" label="Relationship">
                              <Select
                                placeholder="Select relationship"
                                options={[
                                  { value: 'FS', label: 'Finish-to-Start' },
                                  { value: 'SS', label: 'Start-to-Start' },
                                  { value: 'FF', label: 'Finish-to-Finish' },
                                  { value: 'SF', label: 'Start-to-Finish' },
                                ]}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Button
                              type="dashed"
                              onClick={() => {
                                const values = predecessorForm.getFieldsValue();
                                if (values.taskId && values.relation) {
                                  add({ taskId: values.taskId, relation: values.relation });
                                  predecessorForm.resetFields();
                                } else {
                                  message.warning('Please select a task and relationship');
                                }
                              }}
                              block
                              style={{ width: "150px" }} 
                              icon={<PlusOutlined />}
                            >
                              Add Predecessor
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Successors" >
                <Form.List name="successors">
                  {(fields, { add, remove }) => (
                    <>
                      <Table
                        dataSource={fields.map((field, index) => ({
                          key: field.key,
                          taskId: form.getFieldValue(['successors', index, 'taskId']),
                          relation: form.getFieldValue(['successors', index, 'relation']),
                          type: 'successors',
                        }))}
                        columns={relationshipColumns}
                        pagination={false}
                        size="small"
                      />
                      <Form form={successorForm} layout="inline" style={{ marginTop: "24px" }}>
                        <Row gutter={8}>
                          <Col span={12}>
                            <Form.Item name="taskId" label="Task">
                              <Select
                                placeholder="Select successor task"
                                options={allTasks
                                  .filter((task) => task.id !== modalTask?.id && task.type === "activity")
                                  .map((task) => ({
                                    value: task.id,
                                    label: `${task.taskId} - ${task.text}`,
                                  }))}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item name="relation" label="Relationship">
                              <Select
                                placeholder="Select relationship"
                                options={[
                                  { value: 'FS', label: 'Finish-to-Start' },
                                  { value: 'SS', label: 'Start-to-Start' },
                                  { value: 'FF', label: 'Finish-to-Finish' },
                                  { value: 'SF', label: 'Start-to-Finish' },
                                ]}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Button
                              type="dashed"
                              onClick={() => {
                                const values = successorForm.getFieldsValue();
                                if (values.taskId && values.relation) {
                                  add({ taskId: values.taskId, relation: values.relation });
                                  successorForm.resetFields();
                                } else {
                                  message.warning('Please select a task and relationship');
                                }
                              }}
                              block
                              style={{ width: "150px" }} 
                              icon={<PlusOutlined />}
                            >
                              Add Successor
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal
        open={isLinksModalVisible}
        title={<span style={{ color: '#1890ff', fontWeight: 'bold' }}>Task Links</span>}
        onCancel={() => setIsLinksModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsLinksModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
        bodyStyle={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
        }}
      >
        <Table
          dataSource={taskLinks}
          columns={linkColumns}
          pagination={false}
          size="small"
        />
      </Modal>
      <Modal
  open={isDeleteLinkModalVisible}
  title={<span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>Delete Link</span>}
 onOk={async () => {
  try {
    // Get link details before deleting
    const link = gantt.getLink(selectedLinkId);
    const sourceTask = gantt.getTask(link.source);
    const targetTask = gantt.getTask(link.target);
    const relation = linkTypeMap[link.type];
    
    // Delete the link from Gantt
    gantt.deleteLink(selectedLinkId);
    console.log(sourceTask.predecessor)
    console.log(targetTask.predecessor)
    // Update the tasks' predecessor/successor arrays
    if (sourceTask && targetTask) {
      // Remove from target's predecessors
      targetTask.predecessor = (targetTask.predecessor || []).filter(
        p => !(p.taskId === sourceTask.id && p.relation === relation)
      );
      
      // Remove from source's successors  
      sourceTask.successors = (sourceTask.successors || []).filter(
        s => !(s.taskId === targetTask.id && s.relation === relation)
      );
      console.log("After Filtering")
      console.log(sourceTask.predecessor)
    console.log(targetTask.predecessor)
    console.log(sourceTask.successors)
    console.log(targetTask.successors)
      // Update tasks in Gantt
      // gantt.updateTask(sourceTask.id);
      // gantt.updateTask(targetTask.id);

    }
    
    await saveToServer();
    message.success("Link deleted successfully");
  } catch (err) {
    message.error("Failed to delete link");
  } finally {
    setIsDeleteLinkModalVisible(false);
    setSelectedLinkId(null);
  }
}}
  onCancel={() => {
    setIsDeleteLinkModalVisible(false);
    setSelectedLinkId(null);
  }}
  okText="Yes"
  cancelText="No"
  okType="danger"
  wrapClassName="delete-link-modal"
>
  Do you want to delete this link? This will also update predecessors/successors.
</Modal>
      <Modal
        open={isColumnsModalVisible}
        title={<span style={{ color: '#1890ff', fontWeight: 'bold' }}>Customise Table</span>}
        onCancel={cancelColumnSelection}
        onOk={saveColumnSelection}
        width={480}
        bodyStyle={{ backgroundColor: '#ffffff', borderRadius: 8 }}
        wrapClassName="columns-modal"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ color: '#8c8c8c', fontSize: 12 }}>
            Selected items shown in table
            <span className="columns-count-badge">
              {tempSelectedCols.length}/{columnsConfig.length}
            </span>
          </span>
        </div>
        <Checkbox.Group value={tempSelectedCols} onChange={handleColumnSelection}>
          <div className="columns-grid">
            {columnsConfig.map((col) => (
              <Checkbox value={col.name} key={col.name}>
                {col.label}
              </Checkbox>
            ))}
          </div>
        </Checkbox.Group>
      </Modal>
    </div>
  );
};

GanttChart.propTypes = {
  project: PropTypes.object.isRequired,
  isVisualizationOpen: PropTypes.bool.isRequired,
  onToggleVisualization: PropTypes.func.isRequired,
  onTasksChange: PropTypes.func,
};

export default GanttChart;
