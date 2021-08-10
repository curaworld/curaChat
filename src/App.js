import React from 'react';
import * as FlexWebChat from "@twilio/flex-webchat-ui";
import { BrowserRouter as Router, Route, Switch, } from 'react-router-dom';
import Home from './Home'

class App extends React.Component {

  state = {};

  constructor(props) {
    super(props);

    const { configuration } = props;
    FlexWebChat.Manager.create(configuration)
      .then(manager => this.setState({ manager }))
      .catch(error => this.setState({ error }));

    FlexWebChat.Actions.on("afterStartEngagement", (payload) => {
      const { manager } = this.state
      const { selectedOption } = payload.formData;
      if (!selectedOption) return;
      
      const { channelSid } = manager.store.getState().flex.session;

      manager.chatClient.getChannelBySid(channelSid)
        .then(channel => {
            channel.sendMessage(selectedOption);
        });
  });  
 
}




  render() {
    const { manager, error } = this.state;
    console.log("manager", manager)
    // if (manager) {
    //   return (
    //     <FlexWebChat.ContextProvider manager={manager}>
    //       <FlexWebChat.RootContainer />
    //     </FlexWebChat.ContextProvider>
    //   );
    // }

    // if (error) {
    //   console.error("Failed to initialize Flex Web Chat", error);
    // }

    // return null;
    FlexWebChat.MainHeader.defaultProps.imageUrl = "https://harwindersingh.com/flex/img/Cura-Logo-No-Tagline@3x.png"   
    FlexWebChat.MainHeader.defaultProps.titleText = ""
    return(
      <>
      {  manager &&  <FlexWebChat.ContextProvider manager={manager}>
                        <FlexWebChat.RootContainer />
                      </FlexWebChat.ContextProvider>
    }
      <Router basename="/flex/">
          <Switch>
              <Route exact path="/" component={Home} />
          </Switch>
      </Router>
      </>
    )
  }
}

export default App;
