import Web3 from "web3";

const check = async (): Promise<Web3> => {
  const w = (window as unknown) as Window & { ethereum: any; web3: Web3 };

  if (w.ethereum) {
    console.log(`Injected ethereum detected.`);
    const web3 = new Web3(w.ethereum);

    console.log(`Asking ethereum for permission.`);
    return w.ethereum.enable().then(() => {
      console.log(`Accepted.`);
      return web3;
    });
  } else if (w.web3) {
    console.log(`Injected web3 detected.`);
    return new Web3(w.web3.currentProvider);
  }

  throw Error("web3 not found");
};

const getWeb3 = () => {
  return new Promise<Web3 | undefined>((resolve, reject) => {
    // If document has loaded already, try to get Web3 immediately.
    if (document.readyState === "complete") {
      return check()
        .then(resolve)
        .catch(reject);
    }

    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener(`load`, () => {
      check()
        .then(resolve)
        .catch(reject);
    });
  });
};

export default getWeb3;