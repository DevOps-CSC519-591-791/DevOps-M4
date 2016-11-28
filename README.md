# Milestone 4: Incremental Testing Toolkit

By traditional testing technique, the testing team will run every test case in the test suite to make sure the code is not buggy and deliverable.
However, in many times, running one test case is time-consuming, especially for some complex projects.

Here we introduced a tool to perform the incremental testing.  At each time the code want to merge to the product code repo, our tool will analysis which part of code is modified, compared to the existed delivered code, by `git diff`.  Then our tool analysis which test case should or should not be tested. One test case might should not be tested since, according to the history record, it did not touch the modified code.

### Purpose
When testing the project, determine which test case is unnecessary to test and skip that case. 

A test case is no need to test when its covered statements did not appear in `git diff`.

### Technique details


