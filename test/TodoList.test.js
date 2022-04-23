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
})
