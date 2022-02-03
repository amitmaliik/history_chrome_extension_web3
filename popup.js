const MICROSECONDS_PER_DAY = 1000 * 60 * 60 * 24;

function getDownloadBtn() {
  return document.getElementById("download-btn");
}

function fetchData(body) {
  fetch("http://127.0.0.1:5000/push_data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
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
      getDownloadBtn().innerText = "Put History";
    });
}

function onClickDownload() {
  const inputValue = document.getElementById("input-data").value;

  if (inputValue) {
    getDownloadBtn().innerText = "Preparing...";
    const startTime = new Date().getTime() - MICROSECONDS_PER_DAY * 365 * 2;
    let historyData = [];
    chrome.history.search(
      {
        text: "",
        startTime: startTime,
        maxResults: 10000,
      },
      (results) =>
        (historyData = results.map(({ title, url }) => ({
          data1: title,
          data2: url,
        })))
    );

    console.log(historyData, "dsnbdnd");
    fetchData({ historyData: historyData, address: inputValue });
    const body = { id: "", data: "" };
    fetchData(body);
    getDownloadBtn().innerText = "Push history to DB for recommendation.";
  } else {
    alert("Please enter a address");
  }
}

// function triggerDownload(content) {
//     // let link = document.createElement("a");
//     // link.download = "google_chrome_history.json";
//     // link.href = URL.createObjectURL(
//     //     new Blob([content], { type: "octet/stream" })
//     // );

//     // link.click();

//     // URL.revokeObjectURL(link.href);
//     alert("success! history pushed to db for recommendation!")
// }

// var raw = JSON.stringify({
//   "data": "amitmalik history"
// });

document.addEventListener("DOMContentLoaded", function () {
  getDownloadBtn().addEventListener("click", onClickDownload);
});
