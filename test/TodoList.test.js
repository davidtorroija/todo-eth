const { expect } = require("chai");
const TodoList = artifacts.require("TodoList");

contract('TodoList', (accounts) => {
    before(async () => {
        this.todoList = await TodoList.deployed();
    })

    it('contract succesfully deployed!', async () => {
        const address = await this.todoList.address
        // expect(accounts).toContain(this.todolist.address)
        expect(address).to.not.equal(0x0);
        expect(address).to.not.equal(null);
        expect(address).to.not.equal(undefined);
        expect(address).to.not.equal('');
    })

    it('contract succesfully deployed!', async () => {
        const address = await this.todoList.address
        // expect(accounts).toContain(this.todolist.address)
        expect(address).to.not.equal(0x0);
        expect(address).to.not.equal(null);
        expect(address).to.not.equal(undefined);
        expect(address).to.not.equal('');
    })

    it('todo list tasks', async () => {
        const taskCount = await this.todoList.taskCount()
        const task = await this.todoList.tasks(taskCount)
        expect(task.id.toNumber()).to.equal(taskCount.toNumber())
        expect(task.content).to.equal("1. become a crypto developer")
        expect(task.completed).to.equal(false)
        expect(task.id.toNumber()).to.equal(1)
    })

    it('create new task', async () => {
        const result = await this.todoList.createTask('some task')
        const taskCount = (await this.todoList.taskCount()).toNumber()
        expect(taskCount).to.equal(2)
        const event = result.logs[0]
        expect(event.event).to.equal('TaskCreated')
        expect(event.args.content).to.equal('some task')
        expect(event.args.completed).to.equal(false)
        expect(event.args.id.toNumber()).to.equal(2)
    })
})
