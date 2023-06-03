class BankAccount {
  
    constructor(public balance:number) {
        // this.balance = balance;
    }
  
    deposit(amount:number) {
      this.balance += amount;
    }
  
    withdraw(amount:number) {
      if (amount > this.balance) {
        console.log("Insufficient funds");
        return;
      }
      // this.balance -= amount;
    }
  
    getBalance() {
      return this.balance;
    }
  }
  
  let result = new BankAccount(100);
  result.deposit(100);
  result.withdraw(155);
  console.log(result.balance);
  console.log(result.getBalance());
  
  class BankAccount2 extends BankAccount{
      constructor(balance){
          super(balance);
        }
        x(amount){
            return this.getBalance() * amount;
        }
    }
    console.log(result.getBalance());
    let result2 = new BankAccount2(100);
    result2.deposit(100);
    result2.withdraw(155);
    console.log(result2.x(1.5));
    console.log(result2.getBalance());

    // 보여는 준다. 건들진 마라.
//   console.log(result.#balance);
//   result.#balance = -100;
//   console.log(result.#balance);
function createCounter(): () => number {
  let count: number = 0;

  function increment(): number {
    count += 1;
    return count;
  }
  
  return increment;
}
  


  function c(){
    let a = 0;
  }

  c()
  const counter = createCounter();
  console.log(counter()); // 1
  console.log(counter()); // 2
  console.log(counter()); // 3


