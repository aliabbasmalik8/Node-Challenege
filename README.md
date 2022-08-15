# NodeJS Coding Problem

### `node index`
To runs the task

## Available Methods

## `Sequential`
Each task is performed one at a time, with one finishing before another is started.


## `Concurrent`
Concurrency is the capability to deal with lots of things at once.
Traditionally we have been using multiple threads to make progress on more than one task at a time, with each thread-making progress on its own individual task.


## `Parallel`
Parallel operation means that two computations are literally running at the same time. At one point in time, both computations advance. There is no taking turns; they advance at the same time. Naturally this is not possible with single-core CPU, but multiple-core architecture is required instead.

## Explanation
I used Parallel method to complete task because we have to run multiple task parallel, Inn my method i created Pool class to handle a pool of tasks that can be run parallel, we have also alternative way, like i believe we can achieve same goal with clustering.


## helping link
https://bytearcher.com/articles/parallel-vs-concurrent/
https://blog.bitsrc.io/sequential-vs-concurrent-vs-parallelism-87d1907e5be0