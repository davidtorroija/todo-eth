pragma solidity ^0.5.0;

contract TodoList {
    uint public taskCount = 0;

    struct Task {
        uint id;
        string content;
        bool completed;
    }

    mapping(uint => Task) public tasks;

    event TaskCreated(
        uint id,
        string content,
        bool completed
    );

    event TaskUpdated(
        uint id,
        string content,
        bool completed
    );

    constructor() public {
        createTask("1. become a crypto developer");
    }

    function createTask(string memory _content) public {
        taskCount ++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content, false);
    }

    function setTaskCompleteness(uint id, bool _completed) public {
        tasks[id].completed = _completed;
        emit TaskUpdated(id, tasks[id].content, _completed);
    }


}