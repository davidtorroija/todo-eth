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
})
