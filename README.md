# Milestone 4: Incremental Testing Toolkit
This is the repository for [DevOps special milestone](https://github.com/CSC-DevOps/Course/blob/master/Project/M4.md).We built an incremental testing toolkit to achieve test priority. And we use [solar-calc](https://github.ncsu.edu/DevOps-Milestones/solar-calc) as our node.js application.
 - Node.js application: [link](https://github.ncsu.edu/DevOps-Milestones/solar-calc)
 - Screencast: [link](https://youtu.be/GsuOUdD1swY)

### Introduction
In the traditional testing technique, the testing team will run every test case in the test suite to make sure the code is not buggy and deliverable.
However, in many times, running one test case is time-consuming, especially for some complex projects.

Here we introduced a tool to perform the incremental testing.  At each time the code wants to merge to the product code repo, our tool will analysis which part of the code is modified, comparing to the existed delivered code via `git diff`.  Then our tool analysis which test cases should or should not be tested. One test case might not be tested since, according to the history record, it did not touch the modified code.

### Purpose
 - When testing the project, determine which test case is unnecessary to test and skip that case. 
 - A test case is no need to test when its covered statements did not appear in `git diff`.

### Technique Summary
- We used the `diff` tool provided by `git` to find the changes between current work directory and last or previous commit.
- Our analysis unit is the function and we designed this incremental testing toolkit to handle the inner function modification. That is, for one test case, if all of its covered function are not changed in the new commit, it won't be run. On the contrary, it will be tested.
- We used the JS code coverage tool `istanbul` to find which statements one test is covered. Then we wrote scripts to find out which functions these statements are belong to.
- We implemented the visuzlization tool `mochawesome` to show which test cases are actually tested for the modifications in current work directory.
