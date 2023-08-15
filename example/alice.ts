import Hedis from "/Hedis.ts";

!async function main() {
  const hedis = await (new Hedis("alice", "hedis", {
    url: "redis://localhost:6379",
  }).init());

  hedis.on("message", (message) => {
    console.log("message: ", message);
  });

  hedis.request("bob", "request from alice")
    .then((response) => {
      console.log("response: ", response);

      hedis.post("bob", "hello bob");
    })
    .catch((error) => {
      console.error("error: ", error);
    });
}();
