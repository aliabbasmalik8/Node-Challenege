class Pool {
  constructor(concurrency) {
    this.tasks = [];
    this.concurrency = concurrency;
  }

  addTask(task) {
    this.tasks.push(task)
  }

  setConcurrency(concurrency){
    this.concurrency = concurrency;
  }

  getConcurrency(){
    return this.concurrency
  }

  async _executeTasks(iterator) {
    const results = [];
    for (let [_, task] of iterator) {
      try {
        const res = await task.run();
        try {
          await task.onSuccess(res);
          results.push(res);
        } catch (e) {
          await task.onError(res);
        }
      } catch (e) {
        task.onError(e);
      }
    }
    return results;
  }

  async run() {
    const iterator = this.tasks.entries();
    const tasksWorkers = new Array(this.concurrency).fill(iterator).map(this._executeTasks);
    const res = await Promise.allSettled(tasksWorkers);
    const flattenedArrays = [];
    res.forEach((subArray) => {
      if (subArray.value) {
        subArray.value.forEach(elt => flattenedArrays.push(elt))
      }
    })
    this.tasks = [];
    return flattenedArrays;
  }
}

const createTasks = ({numberOfTasks}) => {
  return [...Array(numberOfTasks)].map(() =>
    [...Array(~~(Math.random() * 10 + 3))]
      .map(() => String.fromCharCode(Math.random() * (123 - 97) + 97))
      .join("")
    );
}

const doTask = (taskName) => {
  const begin=Date.now();
  console.log('\x1b[36m', "[TASK] STARTED: " + taskName)
  return new Promise(function(resolve,reject){
    setTimeout(function(){
      const end= Date.now();
      const timeSpent=(end-begin)+ "ms";
      console.log('\x1b[36m', "[TASK] FINISHED: " + taskName + " in " + timeSpent ,'\x1b[0m');
      resolve(taskName);
    },(Math.random()*200));
  });
}

const setConcurrencyAccordingToTime = () => {
  // set concurrency according to time
  const date = new Date();
  const hours = date.getHours()

  if(hours >=9 && hours <= 17) {
    return 4
  }
  return 8
}

const init = async () => {
  const NUM_TASKS = 20;
  const pool = new Pool(setConcurrencyAccordingToTime());

  const taskList = createTasks({numberOfTasks: NUM_TASKS})

  const failedTasks = [];
  const successfulTasks = [];

  console.log('\x1b[36m',`CONCURRENCY = ${pool.getConcurrency()}`)

  for (let i = 0; i < taskList.length; i++) {
    pool.addTask({
      async run() {
        return await doTask(taskList[i])
      },
      async onSuccess(res) {
        console.log(`Run task ${i} successfully, res = ${res}`);
        successfulTasks.push(this);
      },
      async onError(err) {
        console.log(`Task ${i} failed with error = ${err}`);
        failedTasks.push(this);
      }
    })
  }

  const tasksResult = await pool.run();
  console.log(tasksResult);

  console.log(`Num failed tasks: ${failedTasks.length}`);
  console.log(`Num successful tasks: ${successfulTasks.length}`);
}

init()
