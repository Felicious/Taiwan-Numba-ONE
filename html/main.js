// TODO: modify this to work with order
document.querySelector("#btn").addEventListener("click", printHtml);

function printHtml() {
  const name = document.getElementById("select").value;

  /**
   * Wait, i thought i couldn't use document functions
   * only the google apps script one, since i can't use DOM??
   */
  // client waits for server to respond with receipt data
  const data = google.script.run
    .withSuccessHandler(function(data) {
      document.querySelector("#custName").innerHTML = data.name;
      document.querySelector("#custNo").innerHTML = data.github;
      document.querySelector("#orders").innerHTML = data.role;
      document.querySelector("#comments").innerHTML = data.language;
    })
    .getData(name);

  // TODO: serve data as html (how???)
}
