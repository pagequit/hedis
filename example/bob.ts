import Hedis from "/Hedis.ts";

!async function main() {
  const hedis = await (new Hedis("bob", "hedis", {
    url: "redis://localhost:6379",
  }).init());

  hedis.on("message", (message) => {
    console.log("message: ", message);
  });

  hedis.listen((request) => {
    console.log("request: ", request.data);

    setTimeout(() => {
      request.respond("oh, hi alice");
    }, 20);
  });
}();
