# Game state management

Deployed [here](https://aquamarine-eclair-b55a38.netlify.app/)

## TODO

- add controller support along with the existing keybord support. Refer to this for reference:

```js
  pollGamepadInput() {
    const gamepads = navigator.getGamepads()
    if (!gamepads?.[0]) return

    const gamepad = gamepads[0]

    gamepad.buttons.forEach((button, index) => {
      const action = this.gamepadKeyMap[index]

      if (button.pressed) {
        if (this.activeControllerButtons.includes(action)) return
        this.activeControllerButtons.unshift(action)
      } else {
        this.activeControllerButtons = this.activeControllerButtons.filter(
          button => button !== action
        )
      }
    })

    if (this.activeControllerButtons.length > 0) {
      this.activateStick()
    } else {
      this.deactivateStick()
    }
  }
```
