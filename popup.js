const MICROSECONDS_PER_DAY = 1000 * 60 * 60 * 24;

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("download-btn").addEventListener(
      "click", onClickDownload
    );
});

const checkUserCheckBox = () => {
    let userSelectedWebsites = [];
    if (document.getElementById('youtube').checked == true) {
        userSelectedWebsites.push('youtube');
    }
    if (document.getElementById('twitter').checked == true) {
        userSelectedWebsites.push('twitter');
    }
    if (document.getElementById('spotify').checked == true) {
        userSelectedWebsites.push('spotify');
    }
    if (document.getElementById('quora').checked == true) {
        userSelectedWebsites.push('quora');
    }
    if (document.getElementById('medium').checked == true) {
        userSelectedWebsites.push('medium');
    }
    if (document.getElementById('google-news').checked == true) {
        userSelectedWebsites.push('news.google.com');
    }
    if (document.getElementById('all').checked == true) {
        userSelectedWebsites.push('all');
    }
    console.log(userSelectedWebsites);
    return userSelectedWebsites
}

const checkWebsiteRegex = (websiteLinks, userSelectedWebsites) => {
    let historyData = [];

    websiteLinks.forEach((websiteLink) => {
        // alert(websiteLink);
        // alert(websiteLink.url);

        for (let i = 0; i < userSelectedWebsites.length; i++) {
            let userSelectedWebsite = userSelectedWebsites[i];

            if (userSelectedWebsite == 'all') {
                historyData.push(
                    {
                        id: websiteLink.id,
                        visitCount: websiteLink.visitCount,
                        title: websiteLink.title,
                        url: websiteLink.url,
                        category: ""
                    }
                )
            }
            else {
                if (websiteLink.url.match(/`${userSelectedWebsite}`/gi) == true) {
                    // alert('true');
                    historyData.push(
                        {
                            id: websiteLink.id,
                            visitCount: websiteLink.visitCount,
                            title: websiteLink.title,
                            url: websiteLink.url,
                            category: ""
                        }
                    )
                }
                else {
                    // alert('false');
                }
            }
        }
    })
    return historyData;
}

// http://52.14.22.215/
//127.0.0.1:5000/push_data
http: function pushData(payload) {
    alert(JSON.stringify(payload));
    fetch("http://52.14.22.215/push_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
    .then(function (response) {
      return response.text();
    })
    .then(function (response) {
      alert("success! history pushed to db for recommendation!");
    })
    .catch(function (response) {
      alert(response);
    })
    .finally(() => {
      document.getElementById("download-btn").innerText = "Put History";
    });
}

function onClickDownload() {
  alert('ss');
  const inputValue = document.getElementById("input-data").value;

  let userSelectedWebsites = checkUserCheckBox();

  if (inputValue) {
    document.getElementById("download-btn").innerText = "Preparing...";
    const startTime = new Date().getTime() - MICROSECONDS_PER_DAY * 365 * 2;
    let historyData = [];
    chrome.history.search(
        {
            text: "",
            startTime: startTime,
            maxResults: 2,
        },
        (websiteLinks) => {
            // alert(websiteLinks);
            historyData = checkWebsiteRegex(websiteLinks, userSelectedWebsites);
            let payload = {
                'historyData': historyData,
                'address': inputValue
            }
            pushData(payload);
        }
        // pushData({
        //   historyData: results.map((item) => ({
        //     id: item.id,
        //     visitCount: item.visitCount,
        //     title: item.title,
        //     url: item.url,
        //     category: "",
        //   })),
        //   address: inputValue,
        // })
    );

    console.log(historyData, "amit");
    document.getElementById("download-btn").innerText = "Push history to DB for recommendation.";
  } 
  else {
    alert("Please enter a address");
  }
}
