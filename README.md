# Milestone 4: Incremental Testing Toolkit

###  Screencast
 - [link](https://youtu.be/GsuOUdD1swY)

By traditional testing technique, the testing team will run every test case in the test suite to make sure the code is not buggy and deliverable.
However, in many times, running one test case is time-consuming, especially for some complex projects.

Here we introduced a tool to perform the incremental testing.  At each time the code want to merge to the product code repo, our tool will analysis which part of code is modified, compared to the existed delivered code, by `git diff`.  Then our tool analysis which test case should or should not be tested. One test case might should not be tested since, according to the history record, it did not touch the modified code.

### Purpose
When testing the project, determine which test case is unnecessary to test and skip that case. 

A test case is no need to test when its covered statements did not appear in `git diff`.

### Technique details

- We use the `diff` tool provided by `git` to find the changes between commits.
- Our analysis unit is the function. That is, for one test case, if all of its covered function are not changed in the new commit, it won't be tested. On the contrary, it will be tested
- We use the tool `istanbul` to find which statements one test is covered. Then we have the script to find out what functions these statemsnts are belong to.
- We use the tool `mochawesome` to show which test case we actually tested in the new commit.
