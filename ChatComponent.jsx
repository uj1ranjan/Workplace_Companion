// Chatbot.js
import React, { useEffect, useState } from "react";
import { clientApplication } from "../msalConfig";
import { createDirectLine, renderWebChat } from 'botframework-webchat';
import './ChatComponent.css';
import backgroundimage from '../assets/chat-background.jpg';

const Chatbot = ({ user }) => {
  const [directLine, setDirectLine] = useState(null);

  const fetchDirectLineToken = async () => {
    try {
      const response = await fetch("https://4e719def09e4e0ce82787973a70423.0a.environment.api.powerplatform.com/powervirtualagents/botsbyschema/cr61c_agent1_tpLqi8/directline/token?api-version=2022-03-01-preview");
      const { token } = await response.json();

      const backgroundStyle = {
        backgroundImage: `url(${backgroundimage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      };

      const userId = user
        ? `Your-customized-prefix${user.localAccountId}`.substr(0, 64)
        : (Math.random().toString() + Date.now().toString()).substr(0, 64);

      const newDirectLine = window.WebChat.createDirectLine({ token });
      setDirectLine(newDirectLine);

      // Initialize Web Chat with a Redux store
      const store = window.WebChat.createStore({}, ({ dispatch }) => (next) => (action) => {
        const { type } = action;

        if (type === "DIRECT_LINE/CONNECT_FULFILLED") {
          dispatch({
            type: "WEB_CHAT/SEND_EVENT",
            payload: {
              name: "startConversation",
              type: "event",
              value: { text: "hello" },
            },
          });
        }

        if (type === "DIRECT_LINE/INCOMING_ACTIVITY") {
          const activity = action.payload.activity;
          let resourceUri = getOAuthCardResourceUri(activity);
          if (resourceUri) {
            exchangeTokenAsync(resourceUri).then((token) => {
              if (token) {
                newDirectLine
                  .postActivity({
                    type: "invoke",
                    name: "signin/tokenExchange",
                    value: {
                      id: activity.attachments[0].content.tokenExchangeResource.id,
                      connectionName: activity.attachments[0].content.connectionName,
                      token,
                    },
                    from: {
                      id: userId,
                      name: clientApplication.getAccount().name,
                      role: "user",
                    },
                  })
                  .subscribe();
              }
            });
          }
        }

        return next(action);
      });

      const styleOptions = {
        // Hide upload button.
        hideUploadButton: false,
        avatarSize: 40,
        botAvatarImage: '/chatbot-avatar.png',
        botAvatarInitials: '',
        botAvatarBackgroundSize: 'cover',
        botAvatarBackgroundPosition: 'center',
        userAvatarBackgroundSize: 'cover',
        userAvatarBackgroundPosition: 'center',
        bubbleFromUserBackground: '#767e7eff',
        bubbleBackground: '#e4e4fc',
        userAvatarImage: './user-avatar.png',
        userAvatarInitials: '',

        backgroundImage : './chat-background.jpg',

        suggestedActionBackground: '#E6E6E6',
        suggestedActionBorderColor: '#5B5BE8',
        suggestedActionBorderRadius: 10,
        suggestedActionBorderStyle: 'solid',
        suggestedActionBorderWidth: 1,
        suggestedActionDisabledBackground: undefined,
        suggestedActionDisabledBorderColor: '#5B5BE8',
        suggestedActionDisabledBorderStyle: 'solid',
        suggestedActionDisabledBorderWidth: 2,
        suggestedActionHeight: 30,
        suggestedActionImageHeight: 20,
        suggestedActionLayout: 'carousel',
        suggestedActionTextColor: '#5B5BE8',

        emojiSet: true,
        sendBoxButtonColor: '#5B5BE8',

        spinnerAnimationHeight: 16,
        spinnerAnimationWidth: 16,
        spinnerAnimationPadding: 12,

      };

      window.WebChat.renderWebChat(
        {
          directLine: newDirectLine,
          store,
          userID: userId,
          styleOptions,
        },
        document.getElementById("webchat")
      );
    } catch (error) {
      console.error("Error fetching Direct Line token:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDirectLineToken();
    }
  }, [user]);
  return <div id="webchat-container">
    <div id="webchat" >
    </div>
    <footer id='footer'>You can contact Global Helpdesk, Email :<a href="mailto: Global.Helpdesk@tcs.com"> Global.Helpdesk@tcs.com</a> Contact number : <a href="tel:18002576563">18002576563</a> for India.</footer>

  </div>

    ;
};

// Helper functions
function getOAuthCardResourceUri(activity) {
  if (
    activity &&
    activity.attachments &&
    activity.attachments[0] &&
    activity.attachments[0].contentType === "application/vnd.microsoft.card.oauth" &&
    activity.attachments[0].content.tokenExchangeResource
  ) {
    return activity.attachments[0].content.tokenExchangeResource.uri;
  }
}

function exchangeTokenAsync(resourceUri) {
  const user = clientApplication.getAccount();
  if (user) {
    const requestObj = { scopes: [resourceUri] };
    return clientApplication
      .acquireTokenSilent(requestObj)
      .then((tokenResponse) => tokenResponse.accessToken)
      .catch((error) => console.error("Token exchange failed", error));
  }
  return Promise.resolve(null);
}

export default Chatbot;