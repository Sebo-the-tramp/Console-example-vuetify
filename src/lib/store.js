var store = {
    debug: true,
    state: {
      message: 'Benvenuto!',
      show: false,
    },
    setMessageAction (newValue) {
      if (this.debug) console.log('setMessageAction triggered with', newValue)
      this.state.message = newValue
      this.state.show = true
    },
    clearMessageAction () {
      if (this.debug) console.log('clearMessageAction triggered')
      this.state.message = ''
    }
  }

export default {
    data: store,
}