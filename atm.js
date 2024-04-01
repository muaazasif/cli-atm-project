#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import animation from "chalk-animation";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
let myBalance = 10000;
let mypin = 1234;
async function main() {
    const content = `
        ${chalk.blue("🏦 Welcome to the My Bank ATM 🏦")}          

        ${chalk.green("💰 Manage your finances with ease and joy")}     
        ${chalk.green("🎉 Access a range of convenient features")}     
        ${chalk.green("💸 Withdraw, Deposit, Check Balance, and Fast Cash")} 
    `;
    const animatedMessage = animation.rainbow(content.replace(/\x1B\[\d+m/g, ""));
    animatedMessage.start(); // Start animation
    let continueOperation = true;
    while (continueOperation) {
        let answer = await inquirer.prompt({
            message: "Enter Your Pin (Hint:1234)",
            name: "pin",
            type: "number",
        });
        if (answer.pin === mypin) {
            console.log(chalk.green("🔒 Correct Pin Code!!!"));
            let operationans = await inquirer.prompt({
                message: "What do you want ",
                name: "operation",
                type: "list",
                choices: [
                    "💸 Withdraw",
                    "💰 Check Balance",
                    "💸 Fast Cash",
                    "💳 Deposit Money",
                ],
            });
            if (operationans.operation === "💸 Withdraw") {
                let withdraw = await inquirer.prompt({
                    message: "Enter Withdraw Amount ",
                    name: "withdrawamt",
                    type: "number",
                });
                if (myBalance >= withdraw.withdrawamt) {
                    myBalance -= withdraw.withdrawamt;
                    console.log(chalk.green("💸 Withdrawal successful. Your Remaining Balance is ", myBalance));
                    await askForReceipt(withdraw.withdrawamt, myBalance, "Withdraw");
                }
                else {
                    console.log(chalk.red("💔 Transaction cannot proceed due to insufficient balance. "));
                }
            }
            else if (operationans.operation === "💸 Fast Cash") {
                const fastCashOptions = [
                    { name: "💵 5000", value: 5000 },
                    { name: "💵 10000", value: 10000 },
                    { name: "💵 15000", value: 15000 },
                    { name: "💵 20000", value: 20000 },
                ];
                const fastCashSelection = await inquirer.prompt({
                    type: "list",
                    name: "selectedAmount",
                    message: "Choose Fast Cash Amount Option from below ",
                    choices: fastCashOptions,
                });
                const selectedAmount = fastCashSelection.selectedAmount;
                if (myBalance >= selectedAmount) {
                    myBalance -= selectedAmount;
                    console.log(chalk.green("💸 Withdrawal successful. Your Remaining Balance is ", myBalance));
                    await askForReceipt(selectedAmount, myBalance, "Fast Cash");
                }
                else {
                    console.log(chalk.red("💔 Transaction cannot proceed due to insufficient balance."));
                }
            }
            else if (operationans.operation === "💰 Check Balance") {
                console.log("💰 Your Current Balance is ", myBalance);
            }
            else if (operationans.operation === "💳 Deposit Money") {
                const depositAmountResponse = await inquirer.prompt({
                    type: "number",
                    name: "depositAmount",
                    message: "Enter the amount you want to deposit: ",
                });
                if (depositAmountResponse.depositAmount >= 0) {
                    myBalance += depositAmountResponse.depositAmount;
                    console.log(chalk.green(`💳 ${depositAmountResponse.depositAmount} deposited successfully. Your New Balance is ${myBalance}`));
                    await askForReceipt(depositAmountResponse.depositAmount, myBalance, "Deposit Money");
                }
                else {
                    console.log("💔 Deposit amount cannot be negative.");
                }
            }
        }
        else {
            console.log(chalk.red("🚫 Incorrect PIN. Please try again."));
        }
        let continueResponse = await inquirer.prompt({
            type: "confirm",
            name: "continue",
            message: "Do you want to continue or exit?",
            default: true,
        });
        continueOperation = continueResponse.continue;
    }
    console.log(chalk.yellow("👋 Thank you for using the My Bank ATM. Goodbye!"));
}
function generateTransactionId() {
    const uuid = uuidv4(); // Generate UUID
    const transactionId = uuid.replace(/-/g, "").substring(0, 9); // Remove dashes and take the first 9 characters
    return transactionId;
}
async function askForReceipt(withdrawAmt, remainingBalance, transactionType) {
    let receiptResponse = await inquirer.prompt({
        type: "confirm",
        name: "wantReceipt",
        message: "Do you want a receipt for this transaction?",
        default: true,
    });
    if (receiptResponse.wantReceipt) {
        printReceiptMessage(withdrawAmt, remainingBalance, transactionType);
    }
    else {
        console.log("No receipt printed.");
    }
}
function printReceiptMessage(withdrawAmt, remainingBalance, transactionType) {
    const now = moment();
    // Customize transactionType for more contextually accurate receipt messages
    let transactionDescription;
    switch (transactionType) {
        case "Withdraw":
            transactionDescription = "Withdrawal";
            break;
        case "Fast Cash":
            transactionDescription = "Fast Cash Withdrawal";
            break;
        case "Deposit Money":
            transactionDescription = "Deposit";
            break;
        default:
            transactionDescription = "Transaction";
    }
    console.log(`
      ═══════════════════════════════════════════════
                                                    
                        ATM Receipt                        
                                                      
          Date: ${now.format("MMMM D, YYYY")}                       
          Time: ${now.format("h:mm A")}                              
          Transaction ID: ${generateTransactionId()}               
                                                      
          ${transactionDescription} Amount: ${withdrawAmt}                     
          Remaining Balance: ${remainingBalance}                    
                                                      
                    Thank you for using                         
                                                     
      ═════════════════════════════════════════════════
  `);
}
main();
