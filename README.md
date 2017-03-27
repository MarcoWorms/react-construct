> This is just a weird experiment

# http://worms.io/react-construct/

### `app.js`
```javascript
import React, { Component } from 'react';
import './App.css';

import Construct, {
  GameObject, KeyDown,
  bullet, boundToWindow, fade, rotate,
} from './react-construct'

class App extends Component {
  constructor() {
    super()
    this.state = {
      playerAngle: 0
    }
  }
  render() {
    return (
      <Construct>
        <p>Try WASD</p>
        <KeyDown when="w" do={ () => this.setState({ playerAngle: 270 }) } />
        <KeyDown when="a" do={ () => this.setState({ playerAngle: 180 }) } />
        <KeyDown when="s" do={ () => this.setState({ playerAngle: 90 }) } />
        <KeyDown when="d" do={ () => this.setState({ playerAngle: 0 }) } />
        <GameObject
          initial={{ x: 100, y: 100, width: 200, height: 30 }}
          behaviours={[
            bullet({
              speed: 200,
              motionAngle: this.state.playerAngle,
              setAngle: false
            }),
            boundToWindow(),
            fade({ delay: 0, enter:1, stay: 0, leave: 1, loop: true}),
            rotate({ speed: 90 })
          ]}
          style={{ backgroundColor: 'blue', borderRadius: '8px' }}
        />
      </Construct>
    );
  }
}

export default App;
```

### `index.js`
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

### `index.html`
```javascript
<body>
  <div id="root"></div>
</body>
```
