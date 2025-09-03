import express from 'express';
import Project from '../Models/Project.js';
import moment from 'moment';
import { Chart } from '../Models/Chart.js';
import Calendar from '../Models/Calendar.js'; 
const router = express.Router();

router.post('/createproject', async (req, res) => {
  const {
    obsId,
    userId,
    projectId,
    projectStatus,
    projectName,
    owner,
    dueDate,
    startDate,
    endDate,
    manager,
    dayExcudeArray,
    SpecialEvents,
    startIn,
    endIn,
    duration,
    actualStart,
    actualFinish,
    actualduration,
    assignManager,
    workingHours,
    totalFloat,
    remainingDuration,
    scheduleCompletedPercent,
    predecessors,
    successors,
    activityCalendar,
  } = req.body;

  try {
    if (!workingHours || typeof workingHours !== 'object') {
      return res.status(400).json({
        error: 'Working hours must be provided as an object with daily hours',
      });
    }

    const validDays = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];
    let totalWeeklyHours = 0;
    const validatedWorkingHours = {};

    for (const day of validDays) {
      const hours = workingHours[day] || 0;
      if (typeof hours !== 'number' || hours < 0 || hours > 24) {
        return res.status(400).json({
          error: `Invalid hours for ${day}. Must be a number between 0 and 24`,
        });
      }

      validatedWorkingHours[day] = hours;
      totalWeeklyHours += hours;
    }

    const MAX_WEEKLY_HOURS = 168;
    const REASONABLE_WEEKLY_HOURS = 80;

    if (totalWeeklyHours > MAX_WEEKLY_HOURS) {
      return res.status(400).json({
        error: `Total weekly hours (${totalWeeklyHours}) cannot exceed ${MAX_WEEKLY_HOURS} hours`,
      });
    }

    if (totalWeeklyHours > REASONABLE_WEEKLY_HOURS) {
      return res.status(400).json({
        error: `Total weekly hours (${totalWeeklyHours}) exceeds reasonable limit of ${REASONABLE_WEEKLY_HOURS} hours`,
      });
    }

    if (totalWeeklyHours === 0) {
      return res.status(400).json({
        error: 'At least one day must have working hours greater than 0',
      });
    }

    if (dayExcudeArray && Array.isArray(dayExcudeArray)) {
      for (const excludedDay of dayExcudeArray) {
        const dayName = excludedDay.dayName?.toLowerCase?.();
        if (validatedWorkingHours[dayName] > 0) {
          console.warn(
            `Warning: ${dayName} is excluded but has ${validatedWorkingHours[dayName]} working hours`
          );
          totalWeeklyHours -= validatedWorkingHours[dayName];
          validatedWorkingHours[dayName] = 0;
        }
      }
    }

    const enhancedWorkingHours = {
      dailyHours: validatedWorkingHours,
      totalWeeklyHours: totalWeeklyHours,
      workingDays: validDays.filter((day) => validatedWorkingHours[day] > 0),
      nonWorkingDays: validDays.filter(
        (day) => validatedWorkingHours[day] === 0
      ),
      averageDailyHours: totalWeeklyHours / 7,
    };
    const newProject = new Project({
      obsId,
      userId,
      projectId,
      projectStatus,
      projectName,
      owner,
      dueDate,
      startDate,
      endDate,
      actualStart,
      actualFinish,
      actualduration,
      manager: manager?._id,
      dayExcudeArray,
      SpecialEvents,
      duration,
      assignManager,
      totalFloat,
      remainingDuration,
      scheduleCompletedPercent,
      predecessors,
      successors,
      activityCalendar,
      workingHours: enhancedWorkingHours,
    });

    const savedProject = await newProject.save();
    const populatedProject = await Project.findById(savedProject._id)
  .populate('obsId')   // assuming obsId is a ref in schema
  .populate('assignManager').populate('manager').populate('userId')
    let chart = await Chart.findOne({ userId, projectId: savedProject._id });
    if (chart) {
      await chart.delete();
    }
    const newChart = new Chart({
      projectId: savedProject._id,
      userId,
      tasks: [], // No default task created
      workingHours: enhancedWorkingHours,
    });
    await newChart.save();
    const response = {
      ...populatedProject.toJSON(),
      workingHoursSummary: {
        totalWeeklyHours: enhancedWorkingHours.totalWeeklyHours,
        workingDays: enhancedWorkingHours.workingDays,
        averageDailyHours: enhancedWorkingHours.averageDailyHours,
      },
    };

    res.status(201).json(response);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update Project
router.put('/updateproject/:id', async (req, res) => {
  try {
    const {
      projectStatus,
      projectName,
      owner,
      dueDate,
      startDate,
      endDate,
      manager,
      dayExcudeArray,
      SpecialEvents,
      duration,
      actualStart,
      actualFinish,
      actualduration,
      assignManager,
      workingHours,
      totalFloat,
      remainingDuration,
      scheduleCompletedPercent,
      predecessors,
      successors,
      activityCalendar,
    } = req.body;

    // Build update object dynamically
    const updateFields = {};

    if (projectStatus) updateFields.projectStatus = projectStatus;
    if (projectName) updateFields.projectName = projectName;
    if (owner) updateFields.owner = owner;
    if (dueDate && dueDate.trim() !== "") updateFields.dueDate = dueDate;
    if (startDate && startDate.trim() !== "") updateFields.startDate = startDate;
    if (endDate && endDate.trim() !== "") updateFields.endDate = endDate;
    if (manager && manager._id) updateFields.manager = manager._id;
    if (dayExcudeArray) updateFields.dayExcudeArray = dayExcudeArray;
    if (SpecialEvents) updateFields.SpecialEvents = SpecialEvents;
    if (duration) updateFields.duration = duration;
    if (actualStart && actualStart.trim() !== "") updateFields.actualStart = actualStart;
    if (actualFinish && actualFinish.trim() !== "") updateFields.actualFinish = actualFinish;
    if (actualduration) updateFields.actualduration = actualduration;
    if (assignManager && Array.isArray(assignManager)) updateFields.assignManager = assignManager;
    if (totalFloat) updateFields.totalFloat = totalFloat;
    if (remainingDuration) updateFields.remainingDuration = remainingDuration;
    if (scheduleCompletedPercent) updateFields.scheduleCompletedPercent = scheduleCompletedPercent;
    if (predecessors) updateFields.predecessors = predecessors;
    if (successors) updateFields.successors = successors;
    if (activityCalendar) updateFields.activityCalendar = activityCalendar;

    // ---- Handle Working Hours if provided ----
    if (workingHours && typeof workingHours === "object") {
      const validDays = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];

      let totalWeeklyHours = 0;
      const validatedWorkingHours = {};

      for (const day of validDays) {
        const hours = workingHours[day] || 0;
        if (typeof hours !== "number" || hours < 0 || hours > 24) {
          return res.status(400).json({
            error: `Invalid hours for ${day}. Must be a number between 0 and 24`,
          });
        }
        validatedWorkingHours[day] = hours;
        totalWeeklyHours += hours;
      }

      if (totalWeeklyHours > 168) {
        return res.status(400).json({
          error: `Total weekly hours (${totalWeeklyHours}) cannot exceed 168 hours`,
        });
      }
      if (totalWeeklyHours > 80) {
        return res.status(400).json({
          error: `Total weekly hours (${totalWeeklyHours}) exceeds reasonable limit of 80 hours`,
        });
      }
      if (totalWeeklyHours === 0) {
        return res.status(400).json({
          error: "At least one day must have working hours greater than 0",
        });
      }

      const enhancedWorkingHours = {
        dailyHours: validatedWorkingHours,
        totalWeeklyHours,
        workingDays: validDays.filter((d) => validatedWorkingHours[d] > 0),
        nonWorkingDays: validDays.filter((d) => validatedWorkingHours[d] === 0),
        averageDailyHours: totalWeeklyHours / 7,
      };

      updateFields.workingHours = enhancedWorkingHours;

      // Update related chart
      const chart = await Chart.findOne({ projectId: req.params.id });
      if (chart) {
        chart.workingHours = enhancedWorkingHours;
        await chart.save();
      }
    }

    // ---- Perform update ----
    const updatedProject = await Project.findByIdAndUpdate(
  req.params.id,
  { $set: updateFields },
  { new: true }
).populate('assignManager').populate('obsId').populate('userId');

    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json(updatedProject);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Create Global Calendar

router.post('/calendar/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;  
    const { workingHours, dayExcudeArray, SpecialEvents } = req.body;
    const updateFields = { userId };

    // ---- Handle dayExcludes and SpecialEvents ----
    if (dayExcudeArray) updateFields.dayExcudeArray = dayExcudeArray;
    if (SpecialEvents) updateFields.SpecialEvents = SpecialEvents;

    // ---- Validate and compute working hours ----
    if (workingHours && typeof workingHours === "object") {
      const validDays = [
        "monday","tuesday","wednesday","thursday","friday","saturday","sunday"
      ];
      let totalWeeklyHours = 0;
      const validated = {};

      for (const day of validDays) {
        const hours = workingHours[day] || 0;
        if (typeof hours !== "number" || hours < 0 || hours > 24) {
          return res.status(400).json({ error: `Invalid hours for ${day}` });
        }
        validated[day] = hours;
        totalWeeklyHours += hours;
      }

      if (totalWeeklyHours > 80) {
        return res.status(400).json({ error: "Total weekly hours cannot exceed 80" });
      }

      updateFields.workingHours = {
        dailyHours: validated,
        totalWeeklyHours,
        workingDays: validDays.filter(d => validated[d] > 0),
        nonWorkingDays: validDays.filter(d => validated[d] === 0),
        averageDailyHours: totalWeeklyHours / 7,
      };
    }

    // ---- Create or Update (upsert) ----
    const calendar = await Calendar.findOneAndUpdate(
      { userId },
      { $set: updateFields },
      { new: true, upsert: true }
    );

    res.status(200).json(calendar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET calendar for logged-in user
router.get('/calendar/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const calendar = await Calendar.findOne({ userId });

    if (!calendar) {
      return res.status(404).json({ error: "Calendar not found" });
    }

    res.status(200).json(calendar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get('/allProject', async (req, res) => {
  try {
    const projects = await Project.find().populate('assignManager').populate('obsId').populate('userId');
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/allProject/:id', async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.params.id })
      .populate('assignManager')
      .populate('manager')
      .populate('userId').populate("obsId")
      .sort({
        createdAt: -1,
      });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/getSingleProjectById/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('assignManager')
      .populate('manager')
      .populate('userId').populate('obsId');
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const calculateDays = (startDate, endDate, excludeDays, excludeDate) => {
  let totalDays = 0;
  let excludedDaysCount = 0;

  const start = moment(startDate);
  const end = moment(endDate);
  const excludeMomentDate = moment(excludeDate);

  for (let m = moment(start); m.isSameOrBefore(end); m.add(1, 'days')) {
    totalDays++;
    const dayName = m.format('dddd');

    if (excludeDays.includes(dayName) || m.isSame(excludeMomentDate, 'day')) {
      excludedDaysCount++;
    }
  }

  const validDays = totalDays - excludedDaysCount;
  return { totalDays, validDays, excludedDaysCount };
};
router.get('/projectDays/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id)
      .populate('assignManager')
      .populate('manager')
      .populate('userId');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const { startDate, endDate, dayExcudeArray, eventExclude } = project;
    const excludeDays = dayExcudeArray.map((day) => day.dayName);

    const result = calculateDays(startDate, endDate, excludeDays, eventExclude);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
