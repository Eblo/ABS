let activePort = null;

chrome.runtime.onConnect.addListener(port => {
  activePort = port;
  port.onMessage.addListener(async msg => {
    switch (msg.type) {
      case constants.MESSAGE_TYPES.START_SEARCH: {
        // Open a new tab to the engine so that we know the extension is on a page for which it has permission
        chrome.tabs.create({ url: constants.TEST_URL });
        const tab = await getCurrentTab();
        if (tab) startSearches(tab.id);
        break;
      }
      case constants.MESSAGE_TYPES.STOP_SEARCH: {
        stopSearches();
        break;
      }
      default: {
        break;
      }
    }
  });
  port.onDisconnect.addListener(() => {
    activePort = null;
  });
});

chrome.runtime.onMessage.addListener((msg, sender, cb) => {
  switch(msg.type) {
    case constants.MESSAGE_TYPES.GET_SEARCH_COUNTS: {
      if (setSearchCounts) setSearchCounts();
      break;
    }
    case constants.MESSAGE_TYPES.OPEN_URL_IN_BACKGROUND: {
      chrome.tabs.create({
        url: msg.url,
        active: false,
      });
      break;
    }
    default: break;
  }
});
