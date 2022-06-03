App = {
  loading: false,
  contracts: {},
  accounts: [],
  ethProvider: null,
  connected: false,
  installed: false,

  load: async () => {
    await App.loadEthereumProvider()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadEthereumProvider: async () => {
    App.connected = false;
    App.installed = false;
    function isMetaMaskInstalled() {
        return Boolean(window.ethereum && window.ethereum.isMetaMask);
    }

    async function isMetaMaskConnected() {
        const { ethereum } = window;
        App.accounts = await ethereum.request({method: 'eth_accounts'});
        return App.accounts && App.accounts.length > 0;
    }

    async function initialise() {
        connected = await isMetaMaskConnected();
        installed = isMetaMaskInstalled();
        if (!connected) {
          alert("please connect to some accounts")
        }
        if (installed) {
          App.ethProvider = window.ethereum;
        } else {
          alert("please install metamask!")
        }
    }

    await initialise();

    App.ethProvider.on('accountsChanged', async () => {
        initialise();
        window.location.reload();
    });
  },

  loadAccount: async () => {
    // Set the current blockchain account
    // web3.eth.defaultAccount = App.account
    App.selectedAccount = App.accounts[0];
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const todoList = await $.getJSON('TodoList.json')
    App.contracts.TodoList = TruffleContract(todoList)
    App.contracts.TodoList.setProvider(App.ethProvider)

    // Hydrate the smart contract with values from the blockchain
    App.todoList = await App.contracts.TodoList.deployed()
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    $('#account').html(App.selectedAccount)

    // Render Tasks
    await App.renderTasks()

    // Update loading state
    App.setLoading(false)
  },

  renderTasks: async () => {
    // Load the total task count from the blockchain
    const taskCount = await App.todoList.taskCount()
    const $taskTemplate = $('.taskTemplate')

    // Render out each task with a new task template
    for (var i = 1; i <= taskCount; i++) {
      // Fetch the task data from the blockchain
      const task = await App.todoList.tasks(i)
      const taskId = task[0].toNumber()
      const taskContent = task[1]
      const taskCompleted = task[2]

      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find('.content').html(taskContent)
      $newTaskTemplate
        .find('input')
        .prop('name', taskId)
        .prop('checked', taskCompleted)
      // .on('click', App.toggleCompleted)

      // Put the task in the correct list
      if (taskCompleted) {
        $('#completedTaskList').append($newTaskTemplate)
      } else {
        $('#taskList').append($newTaskTemplate)
      }

      // Show the task
      $newTaskTemplate.show()
    }
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  },
  createTask: async () => {
    App.setLoading(true);
    try {
        const newTaskInput = $('#newTask');
        const taskContent = newTaskInput.val();
        const result = await App.todoList.createTask(taskContent, { from: App.selectedAccount });
        window.location.reload();
    } catch (e) {
        console.log(e)
    } finally {
        App.setLoading(false);
    }
  },
  setTaskComplete: async (checkboxItem) => {
    App.setLoading(true);
    try {
        const checked = $(checkboxItem).is(":checked")
        const result = await App.todoList.setTaskCompleteness(checkboxItem.name, checked, { from: App.selectedAccount });
        window.location.reload();
    } catch (e) {
        console.log(e)
    } finally {
        App.setLoading(false);
    }
  },
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})
