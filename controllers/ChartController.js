import express from 'express';
import { Chart } from '../Models/Chart.js'; // Adjust the import paths as needed
import Project from '../Models/Project.js';
import mongoose from 'mongoose';
import _ from 'lodash';
import moment from 'moment';
const router = express.Router();
function findMostPreviousById(arr, id, level) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      // Iterate backward from the current index to find the most previous task with the specified level
      for (let j = i - 1; j >= 0; j--) {
        if (arr[j].level === level) {
          return arr[j];
        }
      }

      // If no task with the specified level is found, search for tasks with a lower level
      let currentLevel = level - 1;
      while (currentLevel >= 0) {
        for (let k = i - 1; k >= 0; k--) {
          if (arr[k].level === currentLevel) {
            return arr[k];
          }
        }
        currentLevel--; // Decrease level and continue searching
      }

      return null; // Return null if no appropriate task is found
    }
  }
  return null; // Return null if the id is not found
}

function countTasksBetween(dbArray, arr, id, level) {
  const mostPreviousTask = findMostPreviousById(arr, id, level);

  if (!mostPreviousTask) {
    return { item: null, count: 0 };
  }

  const startIndex =
    dbArray.findIndex((task) => task.id === mostPreviousTask.id) + 1;

  // Find the end index based on the condition
  const endIndex = dbArray.findIndex(
    (task, idx) => idx > startIndex && task.level >= level
  );

  if (startIndex < 0) {
    return { item: mostPreviousTask, count: 0 };
  }

  // Count the tasks with level greater than the specified level between startIndex and endIndex
  const count = dbArray
    .slice(startIndex, endIndex !== -1 ? endIndex : undefined)
    .filter((task) => task.level > level).length;
  return { item: mostPreviousTask, count };
}

const isItemLast = (array, id) => {
  // Find the index of the item with the given ID
  const index = _.findIndex(array, { id });

  // Check if the index is valid and if it is the last index in the array
  return index !== -1 && index === array.length - 1;
};
export async function updateChartWithRetry(
  updateFunction,
  retries = 5,
  delay = 1000
) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await updateFunction();
    } catch (error) {
      if (error.message.includes('Write conflict')) {
        console.log(
          `Write conflict encountered. Retrying... (${attempt + 1}/${retries})`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error; // Rethrow if it's not a write conflict
      }
    }
  }
  throw new Error('Max retries reached. Operation failed.');
}
router.get('/chartsA/:userId/:projectId', async (req, res) => {
  try {
    const { userId, projectId } = req.params;

    // Check if a chart already exists for the given user and project
    let chart = await Chart.findOne({ userId, projectId });

    if (chart) {
      const tasksWithOrigin = chart.tasks.map((task) =>
        task.level !== 0 ? { ...task, page: '2' } : task
      );
      chart.tasks = tasksWithOrigin;
      res.status(200).json(chart);
    } else {
      // Create a new chart if it doesn't exist
      const newChart = new Chart({ projectId, userId, tasks: [] });
      await newChart.save();
      res.status(201).json(newChart);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/chartsA/:userId/:projectId', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, projectId } = req.params;
    const { tasks, version } = req.body;

    // Map the tasks with updated origin field
    let newTasks = tasks.map((task) =>
      task?.level === 0 || task?.origin === 'wbs'
        ? task
        : {
          ...task,
          origin: 'activity',
          level: task?.level == 1 ? 2 : task?.level,
        }
    );

    // Find the chart by userId and projectId
    const chart = await Chart.findOne({ userId, projectId }).session(session);

    if (!chart) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Chart not found' });
    }

    // Update the tasks array in the chart
    const updateFunction = async () => {
      return await Chart.findOneAndUpdate(
        { _id: chart._id },
        { tasks: newTasks, __v: version + 1 },
        { new: true, session }
      );
    };

    const updatedChart = await updateChartWithRetry(updateFunction);

    if (!updatedChart) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(409)
        .json({ error: 'Conflict: Chart was updated by another request' });
    }
    await session.commitTransaction();
    session.endSession();

    res.status(200).json(updatedChart);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});
router.get('/charts/:userId/:projectId', async (req, res) => {
  try {
    const { userId, projectId } = req.params;

    // Check if a chart already exists for the given user and project
    let chart = await Chart.findOne({ userId, projectId });
    // console.log(typeof chart);
    if (chart) {
      // Send the existing chart with tasks
      let newTasks = chart?.tasks?.filter(
        (d) => d?.level == 0 || d?.origin == 'wbs'
      );
      chart.tasks = [...newTasks];
      res.status(200).json(chart);
    } else {
      // Create a new chart if it doesn't exist
      const newChart = new Chart({ projectId, userId, tasks: [] });
      await newChart.save();
      res.status(201).json(newChart);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Helper function to add working days to a date, excluding weekends and holidays
// Replace your current addWorkingDays function with:
const addWorkingDays = (startDate, days, excludedDays = [], specialEvents = []) => {
  const moment = require('moment');
  
  let currentDate = moment(startDate);
  let addedValidDays = 0;
  
  const excludeDayNames = excludedDays.map(day => day.dayName);
  const excludeMomentDates = specialEvents.map(event => moment(event.date));
  
  while (addedValidDays < days) {
    currentDate.add(1, 'days');
    
    const dayName = currentDate.format('dddd');
    const isDayExcluded = excludeDayNames.includes(dayName);
    const isSpecialEventDay = excludeMomentDates.some(excludeDate => currentDate.isSame(excludeDate, 'day'));
    
    if (!isDayExcluded && !isSpecialEventDay) {
      addedValidDays++;
    }
  }
  
  return currentDate.toDate();
};

// Helper function to calculate working days between two dates
// Replace your current calculateWorkingDays function with:
const calculateWorkingDays = (startDate, endDate, excludedDays = [], specialEvents = []) => {
  const moment = require('moment'); // Add this import if not already present
  
  let totalDays = 0;
  let excludedDaysCount = 0;

  const start = moment(startDate);
  const end = moment(endDate);
  
  // Convert specialEvents to moment objects for comparison
  const excludeMomentDates = specialEvents.map(event => moment(event.date));
  
  // Convert excludedDays to array of day names
  const excludeDayNames = excludedDays.map(day => day.dayName);

  for (let m = moment(start); m.isSameOrBefore(end); m.add(1, 'days')) {
    totalDays++;
    const dayName = m.format('dddd');

    // Check if day is excluded by day name or special event
    const isDayExcluded = excludeDayNames.includes(dayName);
    const isSpecialEventDay = excludeMomentDates.some(excludeDate => m.isSame(excludeDate, 'day'));
    
    if (isDayExcluded || isSpecialEventDay) {
      excludedDaysCount++;
    }
  }

  const validDays = totalDays - excludedDaysCount;
  return validDays;
};

// Helper function to apply relationship constraints
const applyRelationshipConstraints = (tasks, project) => {
  const taskMap = new Map();
  tasks.forEach(task => taskMap.set(task.id, task));
  
  let changed = true;
  let iterations = 0;
  const maxIterations = 10; // Prevent infinite loops
  
  while (changed && iterations < maxIterations) {
    changed = false;
    iterations++;
    
    for (const task of tasks) {
      if (!task.predecessor || !Array.isArray(task.predecessor)) continue;
      
      for (const pred of task.predecessor) {
        const predecessorTask = taskMap.get(pred.taskId);
        if (!predecessorTask) continue;
        
        let newStartDate = null;
        let newEndDate = null;
        
        switch (pred.relation) {
          case 'FS': // Finish to Start
            newStartDate = new Date(predecessorTask.end);
            newStartDate.setDate(newStartDate.getDate() + 1);
            break;
            
          case 'SS': // Start to Start
            newStartDate = new Date(predecessorTask.start);
            break;
            
          case 'FF': // Finish to Finish
            newEndDate = new Date(predecessorTask.end);
            break;
            
          case 'SF': // Start to Finish
            newEndDate = new Date(predecessorTask.start);
            newEndDate.setDate(newEndDate.getDate() - 1);
            break;
        }
        
        if (newStartDate && new Date(task.start) < newStartDate) {
          task.start = newStartDate.toISOString();
          if (!newEndDate) {
            task.end = addWorkingDays(
  newStartDate, 
  task.duration, 
  project.dayExcudeArray, 
  project.SpecialEvents,
  project.workingHours
).toISOString();
          }
          changed = true;
        }
        
        if (newEndDate && new Date(task.end) !== new Date(newEndDate)) {
          task.end = newEndDate.toISOString();
          if (!newStartDate) {
            const startDate = new Date(newEndDate);
            startDate.setDate(startDate.getDate() - task.duration + 1);
            task.start = startDate.toISOString();
          }
          changed = true;
        }
      }
    }
  }
  
  return tasks;
};

// Helper function to update parent dates based on children

const updateParentDates = (tasks, project) => {
  const taskMap = new Map();
  tasks.forEach(task => taskMap.set(task.id, task));
  
  // Get all tasks that have children
  const parentsWithChildren = new Map();
  tasks.forEach(task => {
    if (task.parent && task.parent !== 0) {
      if (!parentsWithChildren.has(task.parent)) {
        parentsWithChildren.set(task.parent, []);
      }
      parentsWithChildren.get(task.parent).push(task);
    }
  });
  
  // Process multiple times to handle nested hierarchies
  let iterations = 0;
  const maxIterations = 10;
  
  while (iterations < maxIterations) {
    let hasChanges = false;
    
    parentsWithChildren.forEach((children, parentId) => {
      const parent = taskMap.get(parentId);
      if (!parent) return;
      
      const childStartDates = children.map(child => new Date(child.start));
      const childEndDates = children.map(child => new Date(child.end));
      
      const earliestStart = new Date(Math.min(...childStartDates));
      const latestEnd = new Date(Math.max(...childEndDates));
      
      if (new Date(parent.start).getTime() !== earliestStart.getTime()) {
        parent.start = earliestStart.toISOString();
        hasChanges = true;
      }
      
      if (new Date(parent.end).getTime() !== latestEnd.getTime()) {
        parent.end = latestEnd.toISOString();
        hasChanges = true;
      }
      
      parent.duration = calculateWorkingDays(parent.start, parent.end, project.dayExcudeArray, project.SpecialEvents);
    });
    
    if (!hasChanges) break;
    iterations++;
  }
  
  return tasks;
};

// Helper function to update project dates in the Project collection
const updateProjectDates = async (project,projectId, tasks) => {
  const projectTasks = tasks.filter(task => task.type === 'project');
  
  if (projectTasks.length > 0) {
    const allStartDates = projectTasks.map(task => new Date(task.start));
    const allEndDates = projectTasks.map(task => new Date(task.end));
    
    const projectStartDate = new Date(Math.min(...allStartDates));
    const projectEndDate = new Date(Math.max(...allEndDates));
    const totalDuration = calculateWorkingDays(
  projectStartDate, 
  projectEndDate, 
  project.dayExcudeArray||[], 
  project.SpecialEvents||[]
);
    
    await Project.findByIdAndUpdate(projectId, {
      startDate: projectStartDate,
      endDate: projectEndDate,
      duration: totalDuration
    });
  }
};

// Helper function to detect and handle relationship changes
const handleRelationshipChanges = (existingTasks, incomingTasks) => {
  const existingTaskMap = new Map();
  const incomingTaskMap = new Map();
  
  existingTasks.forEach(task => existingTaskMap.set(task.id, task));
  incomingTasks.forEach(task => incomingTaskMap.set(task.id, task));

  // Process each incoming task for relationship changes
  incomingTasks.forEach(incomingTask => {
    const existingTask = existingTaskMap.get(incomingTask.id);
    
    if (existingTask) {
      // Compare predecessors to detect changes
      const existingPreds = existingTask.predecessor || [];
      const incomingPreds = incomingTask.predecessor || [];
      
      // Convert to comparable format
      const existingPredSet = new Set(existingPreds.map(p => `${p.taskId}-${p.relation}`));
      const incomingPredSet = new Set(incomingPreds.map(p => `${p.taskId}-${p.relation}`));
      
      // Detect removed relationships
      const removedRels = existingPreds.filter(p => 
        !incomingPredSet.has(`${p.taskId}-${p.relation}`)
      );
      
      // Detect added relationships
      const addedRels = incomingPreds.filter(p => 
        !existingPredSet.has(`${p.taskId}-${p.relation}`)
      );
      
      // Log relationship changes for debugging
      if (removedRels.length > 0) {
        console.log(`Removed relationships for task ${incomingTask.id}:`, removedRels);
      }
      if (addedRels.length > 0) {
        console.log(`Added relationships for task ${incomingTask.id}:`, addedRels);
      }
    }
  });
};

// Helper function to synchronize bidirectional relationships
const synchronizeRelationships = (tasks) => {
  const taskMap = new Map();
  tasks.forEach(task => {
    taskMap.set(task.id, {
      ...task,
      predecessor: task.predecessor || [],
      successors: task.successors || []
    });
  });

  // Clear all successor arrays first to rebuild them
  taskMap.forEach(task => {
    task.successors = [];
  });

  // Build successors based on predecessors
  taskMap.forEach(task => {
    if (Array.isArray(task.predecessor)) {
      task.predecessor.forEach(pred => {
        const predecessorTask = taskMap.get(pred.taskId);
        if (predecessorTask) {
          // Add this task as a successor to its predecessor
          const successorExists = predecessorTask.successors.some(
            s => s.taskId === task.id && s.relation === pred.relation
          );
          
          if (!successorExists) {
            predecessorTask.successors.push({
              taskId: task.id,
              relation: pred.relation
            });
          }
        }
      });
    }
  });

  // Clean up any orphaned relationships
  taskMap.forEach(task => {
    // Remove predecessors that reference non-existent tasks
    task.predecessor = task.predecessor.filter(pred => taskMap.has(pred.taskId));
    
    // Remove successors that reference non-existent tasks
    task.successors = task.successors.filter(succ => taskMap.has(succ.taskId));
  });

  // Convert back to array
  return Array.from(taskMap.values());
};

// Helper function to remove duplicate relationships
const removeDuplicateRelationships = (tasks) => {
  return tasks.map(task => {
    if (task.predecessor && Array.isArray(task.predecessor)) {
      // Remove duplicates based on taskId and relation
      const seen = new Set();
      task.predecessor = task.predecessor.filter(pred => {
        const key = `${pred.taskId}-${pred.relation}`;
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
    }
    
    if (task.successors && Array.isArray(task.successors)) {
      const seen = new Set();
      task.successors = task.successors.filter(succ => {
        const key = `${succ.taskId}-${succ.relation}`;
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
    }
    
    return task;
  });
};

// Enhanced PUT API with relationship handling
router.put('/charts/:userId/:projectId', async (req, res) => {
  try {
    const { userId, projectId } = req.params;
    const { tasks: incomingTasks, version } = req.body;

    const chart = await Chart.findOne({ userId, projectId });
    const project = await Project.findById(projectId);

    if (!chart) {
      return res.status(404).json({ error: 'Chart not found' });
    }

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Detect relationship changes for logging/debugging
    handleRelationshipChanges(chart.tasks, incomingTasks);

    const ids = chart.tasks.map((d) => d.id);
    const newAppend = incomingTasks.filter((d) => !ids.includes(d.id));
    const updatedTasks = [];

    // Update existing tasks (including relationship changes)
    for (const existingTask of chart.tasks) {
      const updatedFromClient = incomingTasks.find((d) => d.id === existingTask.id);
      if (updatedFromClient) {
        // Merge existing task with client updates, including relationships
        const mergedTask = { ...existingTask, ...updatedFromClient };
        if (mergedTask.start && mergedTask.end) {
  mergedTask.duration = calculateWorkingDays(
    mergedTask.start,
    mergedTask.end,
    project.dayExcudeArray,
    project.SpecialEvents
  );
}
        
        // Ensure relationship arrays are properly set
        if (!mergedTask.predecessor) mergedTask.predecessor = [];
        if (!mergedTask.successors) mergedTask.successors = [];
        
        updatedTasks.push(mergedTask);
      } else {
        updatedTasks.push(existingTask);
      }
    }

    // Add new tasks with proper positioning
    for (const appendTask of newAppend) {
      // Initialize relationship arrays for new tasks
      const taskToAdd = {
        ...appendTask,
        predecessor: appendTask.predecessor || [],
        successors: appendTask.successors || [],
        origin: 'wbs'
      };

      if (taskToAdd.start && taskToAdd.end) {
  taskToAdd.duration = calculateWorkingDays(
    taskToAdd.start,
    taskToAdd.end,
    project.dayExcudeArray,
    project.SpecialEvents
  );
}

      if (isItemLast(incomingTasks, appendTask?.id)) {
        updatedTasks.push(taskToAdd);
      } else {
        if (appendTask.level === 0) {
          updatedTasks.unshift(taskToAdd);
        } else {
          const previousItem = countTasksBetween(
            updatedTasks,
            incomingTasks,
            appendTask.id,
            appendTask.level
          );
          if (previousItem) {
            const index = updatedTasks.findIndex(
              (item) => item.id === previousItem?.item?.id
            );
            if (index !== -1) {
              updatedTasks.splice(index + 1 + previousItem?.count, 0, taskToAdd);
            }
          }
        }
      }
    }

    // Synchronize bidirectional relationships (handles add/delete/update)
    let synchronizedTasks = synchronizeRelationships(updatedTasks);
    synchronizedTasks = removeDuplicateRelationships(synchronizedTasks);

    // Apply relationship constraints to adjust dates
    const constrainedTasks = applyRelationshipConstraints(synchronizedTasks, project);
    
    // Update parent dates based on children
    const finalTasks = updateParentDates(constrainedTasks, project);

    // Update the chart
    const updatedChart = await updateChartWithRetry(() =>
      Chart.findOneAndUpdate(
        { _id: chart._id },
        { tasks: finalTasks },
        { new: true }
      )
    );

    if (!updatedChart) {
      return res
        .status(409)
        .json({ error: 'Conflict: Chart was updated by another request' });
    }

    // Update project dates
    await updateProjectDates(project,projectId, finalTasks);

    res.status(200).json(updatedChart);
  } catch (error) {
    console.error('Error in PUT /charts:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Enhanced DELETE API
router.delete('/charts/:userId/:projectId/:taskId', async (req, res) => {
  try {
    const { userId, projectId, taskId } = req.params;

    const chart = await Chart.findOne({ userId, projectId });
    const project = await Project.findById(projectId);
    
    if (!chart) {
      return res.status(404).json({ error: 'Chart not found' });
    }

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const tasks = Array.isArray(chart.tasks) ? chart.tasks : [];

    // Build a set of IDs to delete: the selected task and all descendants
    const idsToDelete = new Set([taskId]);
    let added = true;
    while (added) {
      added = false;
      for (const t of tasks) {
        if (t?.parent && idsToDelete.has(t.parent) && !idsToDelete.has(t.id)) {
          idsToDelete.add(t.id);
          added = true;
        }
      }
    }

    // Filter out tasks to delete
    let updatedTasks = tasks.filter((t) => !idsToDelete.has(t?.id));

    // Cleanup predecessor/successor references on the remaining tasks
    updatedTasks = updatedTasks.map((t) => {
      const clone = { ...t };
      
      // Clean predecessors
      if (Array.isArray(clone.predecessor)) {
        clone.predecessor = clone.predecessor.filter((p) => !idsToDelete.has(p.taskId));
      }
      
      // Clean successors
      if (Array.isArray(clone.successors)) {
        clone.successors = clone.successors.filter((s) => !idsToDelete.has(s.taskId));
      }
      
      // Handle orphaned tasks
      if (clone.parent && idsToDelete.has(clone.parent)) {
        delete clone.parent;
        if (typeof clone.level === 'number' && clone.level > 0) {
          clone.level = clone.level - 1;
        }
      }
      
      return clone;
    });

    // Apply relationship constraints after deletion
    const constrainedTasks = applyRelationshipConstraints(updatedTasks, project);
    
    // Update parent dates based on remaining children
    const finalTasks = updateParentDates(constrainedTasks,project);

    const updatedChart = await updateChartWithRetry(() =>
      Chart.findOneAndUpdate(
        { _id: chart._id },
        { tasks: finalTasks },
        { new: true }
      )
    );

    if (!updatedChart) {
      return res
        .status(409)
        .json({ error: 'Conflict: Chart was updated by another request' });
    }

    // Update project dates
    await updateProjectDates(project,projectId, finalTasks);

    res.status(200).json(updatedChart);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});





// router.put('/charts/:userId/:projectId', async (req, res) => {
//   try {
//     const { userId, projectId } = req.params;
//     const { tasks: incomingTasks, version } = req.body;

//     const chart = await Chart.findOne({ userId, projectId });

//     if (!chart) {
//       return res.status(404).json({ error: 'Chart not found' });
//     }

//     const ids = chart.tasks.map((d) => d.id);
//     const newAppend = incomingTasks.filter((d) => !ids.includes(d.id));
//     const updatedTasks = [];
//     for (const existingTask of chart.tasks) {
//       const updatedFromClient = incomingTasks.find((d) => d.id === existingTask.id);
//       if (updatedFromClient) {
//         updatedTasks.push({ ...existingTask, ...updatedFromClient });
//       } else {
//         updatedTasks.push(existingTask);
//       }
//     }

//     for (const appendTask of newAppend) {
//       if (isItemLast(incomingTasks, appendTask?.id)) {
//         updatedTasks.push({ ...appendTask, origin: 'wbs' });
//       } else {
//         if (appendTask.level === 0) {
//           updatedTasks.unshift({ ...appendTask });
//         } else {
//           const previousItem = countTasksBetween(
//             updatedTasks,
//             incomingTasks,
//             appendTask.id,
//             appendTask.level
//           );
//           if (previousItem) {
//             const index = updatedTasks.findIndex(
//               (item) => item.id === previousItem?.item?.id
//             );
//             if (index !== -1) {
//               updatedTasks.splice(index + 1 + previousItem?.count, 0, {
//                 ...appendTask,
//                 origin: 'wbs',
//               });
//             }
//           }
//         }
//       }
//     }

//     const updatedChart = await updateChartWithRetry(() =>
//       Chart.findOneAndUpdate(
//         { _id: chart._id },
//         { tasks: updatedTasks },
//         { new: true }
//       )
//     );

//     if (!updatedChart) {
//       return res
//         .status(409)
//         .json({ error: 'Conflict: Chart was updated by another request' });
//     }

//     res.status(200).json(updatedChart);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Delete a task (and its descendants) by taskId from a user's project chart
// router.delete('/charts/:userId/:projectId/:taskId', async (req, res) => {
//   try {
//     const { userId, projectId, taskId } = req.params;

//     const chart = await Chart.findOne({ userId, projectId });
//     if (!chart) {
//       return res.status(404).json({ error: 'Chart not found' });
//     }

//     const tasks = Array.isArray(chart.tasks) ? chart.tasks : [];

//     // Build a set of IDs to delete: the selected task and all descendants
//     const idsToDelete = new Set([taskId]);
//     let added = true;
//     while (added) {
//       added = false;
//       for (const t of tasks) {
//         if (t?.parent && idsToDelete.has(t.parent) && !idsToDelete.has(t.id)) {
//           idsToDelete.add(t.id);
//           added = true;
//         }
//       }
//     }

//     // Filter out tasks to delete
//     let updatedTasks = tasks.filter((t) => !idsToDelete.has(t?.id));

//     // Cleanup predecessor/successor references on the remaining tasks
//     updatedTasks = updatedTasks.map((t) => {
//       const clone = { ...t };
//       if (Array.isArray(clone.predecessors)) {
//         clone.predecessors = clone.predecessors.filter((p) => !idsToDelete.has(p));
//       }
//       if (Array.isArray(clone.successors)) {
//         clone.successors = clone.successors.filter((s) => !idsToDelete.has(s));
//       }
//       // If a task had parent that is deleted and somehow remains, drop the parent
//       if (clone.parent && idsToDelete.has(clone.parent)) {
//         delete clone.parent;
//         // Optionally adjust level if needed
//         if (typeof clone.level === 'number' && clone.level > 0) {
//           clone.level = clone.level - 1;
//         }
//       }
//       return clone;
//     });

//     const updatedChart = await updateChartWithRetry(() =>
//       Chart.findOneAndUpdate(
//         { _id: chart._id },
//         { tasks: updatedTasks },
//         { new: true }
//       )
//     );

//     if (!updatedChart) {
//       return res
//         .status(409)
//         .json({ error: 'Conflict: Chart was updated by another request' });
//     }

//     res.status(200).json(updatedChart);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// Delete a project
router.delete('/project/:userId/:projectId',async(req,res)=>
{
  const{userId,projectId}=req.params
  const project_to_delete= await Project.findOne({_id:projectId,userId:userId})
  if(!project_to_delete)
  {
    return res.status(400).json({'message':'No such Project Found'})
  }
  await Project.findOneAndDelete({_id:projectId,userId:userId})
  await Chart.deleteMany({projectId:projectId})
  return res.status(200).json({'message':'Project Deleted Successfully'})
})
export default router;
