class Flag {
    #flag: string;
    constructor(flag: string) {
      this.#flag = flag;
    }
  }

  const flag = new Flag("flag{123}");
  console.log(flag);