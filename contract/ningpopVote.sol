// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

contract VoteService {

    struct Topic {
        uint256 topicNo;
        string question;
        string option1;
        string option2;
        uint256 option1VoteCount;
        uint256 option2VoteCount;
        bool exists;
    }

    address[] private organizerList;
    uint256 private _topicNo;
    mapping (uint256 => Topic) private topicList;
    mapping (address => mapping(uint256 => bool)) private hasVoted;

    error InvalidPermission(uint256 errorCode, string message);
    function revertInvalidPermission() internal pure {
        revert InvalidPermission(1000, "Invalid Permission");
    }

    error InvalidTopic(uint256 errorCode, string message);
    function revertInvalidTopic() internal pure {
        revert InvalidTopic(2000, "Topic not found");
    }

    error AlreadyVoted(uint256 errorCode, string message);
    function revertAlreadyVoted() internal pure {
        revert AlreadyVoted(3000, "User has already voted on this topic");
    }

    error InvalidVoteOption(uint256 errorCode, string message);
    function revertInvalidVoteOption() internal pure {
        revert InvalidVoteOption(4000, "Invalid vote option");
    }

    event TopicCreated(uint256 topicNo, string question, string option1, string option2);
    event Voted(uint256 topicNo, address voter, uint8 option);

    constructor(address ownerAddress) {
        organizerList.push(ownerAddress);
        _topicNo = 0;
    }

    modifier autoIncrement() {
        _topicNo++;
        _;
    }

    modifier onlyOrganizer(address requestAddress) {
        bool isOrganizer = false;
        for (uint256 i = 0; i < organizerList.length; i++) {
            if (organizerList[i] == requestAddress) {
                isOrganizer = true;
                break;
            }
        }
        if (!isOrganizer) {
            revertInvalidPermission();
        }
        _;
    }

    function createTopic(address requestAddress, string memory _question, string memory _option1, string memory _option2) 
        public onlyOrganizer(requestAddress) autoIncrement  {
        
        topicList[_topicNo] = Topic({
            topicNo: _topicNo,
            question: _question,
            option1: _option1,
            option2: _option2,
            option1VoteCount: 0,
            option2VoteCount: 0,
            exists: true
        });
        emit TopicCreated(_topicNo, _question, _option1, _option2);
    }

    function getTopic(uint256 topicNo) public view returns (Topic memory) {
        if (!topicList[topicNo].exists) {
            revertInvalidTopic();
        }
        return topicList[topicNo];
    }

    function vote(address userAddress, uint256 topicNo, uint8 option) public {
        if (!topicList[topicNo].exists) {
            revertInvalidTopic();
        }
        if (hasVoted[userAddress][topicNo]) {
            revertAlreadyVoted();
        }
        if (option != 1 && option != 2) {
            revertInvalidVoteOption();
        }
        
        if (option == 1) {
            topicList[topicNo].option1VoteCount++;
        } else {
            topicList[topicNo].option2VoteCount++;
        }
        hasVoted[userAddress][topicNo] = true;
        emit Voted(topicNo, userAddress, option);
    }

    function getVoteResult(uint256 topicNo) public view returns (uint256, uint256) {
        if (!topicList[topicNo].exists) {
            revertInvalidTopic();
        }
        return (topicList[topicNo].option1VoteCount, topicList[topicNo].option2VoteCount);
    }

    function hasUserVoted(uint256 topicNo, address userAddress) public view returns (bool) {
        return hasVoted[userAddress][topicNo];
    }
}