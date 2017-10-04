import React, { Component } from 'react';
import { Button } from 'wagtail';

import { getInitialContentState, saveContentState } from './utils';

import Editor from './Editor';
import Highlight from './Highlight';

const initialContentState = getInitialContentState();

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contentState: initialContentState,
        };

        this.onSave = this.onSave.bind(this);
    }

    onSave(contentState) {
      this.setState({
        contentState,
      });

      saveContentState(contentState);
    }

    render() {
        const { contentState } = this.state;

        return (
            <div>
                <Editor
                  rawContentState={initialContentState}
                  onSave={this.onSave}
              />
                <hr/>
                <Highlight value={JSON.stringify(contentState, null, 2)} language="js" />
            </div>
        );
    }
}

export default App;
