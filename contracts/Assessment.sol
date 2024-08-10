// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;
    uint256 public credit;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event GetLoan(uint256 amount);
    event PayLoan(uint256 amount);

    constructor(uint initBalance, uint initCredit) payable {
        owner = payable(msg.sender);
        balance = initBalance;
        credit = initCredit;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function getCredit() public view returns(uint256) {
        return credit;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }

    error TooHighLoanAmount(uint256 credit, uint256 amount);
    error PreviousCreditPending(uint256 credit);

    function getloan(uint256 _amount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _pendingCredit = credit;
        if(_amount > 100) {
            revert TooHighLoanAmount({
                credit: credit,
                amount: _amount
            });
        }
        else if(credit + _amount > 200) {
            revert PreviousCreditPending({
                credit: credit
            });
        }
        credit += _amount;
        uint prev_balance = balance;
        balance += _amount;

        assert(balance == (prev_balance + _amount));
        assert(credit == (_pendingCredit + _amount));

        emit GetLoan(_amount);
    }

    error LoanRepayError(uint256 credit,uint256 amount);
    function payLoan(uint _amount) public payable {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _pendingCredit = credit;
        uint prevBalance = balance;
        if(_amount > credit) {
            revert LoanRepayError({
                credit: credit,
                amount: _amount
            });
        }
        else if(_amount > balance) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _amount
            });
        }
        credit -= _amount;
        balance -= _amount;

        assert(credit == _pendingCredit - _amount);
        assert(balance == prevBalance - _amount);

        emit PayLoan(_amount);
    }
}
