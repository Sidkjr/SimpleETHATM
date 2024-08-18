// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Grading {
    
    address adminAcc;
    uint noOfEntries;
    struct Student {
        uint256 rollNo;
        uint256 calcMarks;
        uint256 cSMarks;
        uint256 languageMarks;
        uint256 historyMarks;
    }

    Student[] students;
    mapping(uint => bool) public isStudent;

    event AddMarksEntry(uint _rollNo);
    event RemoveEntry(uint _rollNo);

    constructor() payable {
        adminAcc = payable(msg.sender);
        noOfEntries = 0;
    }

    function getStudentMarks() public view returns (Student[] memory) {
        return students;

    }

    function getEntries() public view returns (uint) {
        return noOfEntries;

    }

    function addStudentMarks(uint _rollNo, uint _calcMarks, uint _cSMarks, uint _languageMarks, uint _historyMarks) public {

        require(isStudent[_rollNo] == false, "The entry is already present");
        Student memory studentEntry = Student({
            rollNo: _rollNo,
            calcMarks: _calcMarks,
            cSMarks: _cSMarks,
            languageMarks: _languageMarks,
            historyMarks: _historyMarks
        });
        noOfEntries += 1;
        students.push(studentEntry);
        isStudent[_rollNo] = true;
        emit AddMarksEntry(_rollNo);
    }

    function removeStudentEntry(uint _rollNo) public {

        require(isStudent[_rollNo] == true, "The student with given ID doesn't exist");

        uint256 indexToRemove = 0;
        for (uint i = 0; i < students.length; i++) {
            if (students[i].rollNo == _rollNo) {
                indexToRemove = i;
                break;
            }
        }

        students[indexToRemove] = students[students.length - 1];
        students.pop();
        isStudent[_rollNo] = false;
        noOfEntries -= 1;

        emit RemoveEntry(_rollNo);

    }


}