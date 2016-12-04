# DevOps-M4: Incremental Testing Toolkit
This is the repository for [DevOps special milestone](https://github.com/CSC-DevOps/Course/blob/master/Project/M4.md).We built an incremental testing toolkit to achieve test priority purpose. And we use [solar-calc](https://github.ncsu.edu/DevOps-Milestones/solar-calc) as our node.js application.
 - Node.js application: [link](https://github.ncsu.edu/DevOps-Milestones/solar-calc)
 - Screencast: [link](https://youtu.be/GsuOUdD1swY)

### Introduction
In the traditional testing technique, the testing team will run every test case in the test suite to make sure the code is robust and deliverable.
However, in many times, running all test cases is time-consuming, especially for some complex projects.

Here we introduced a tool to perform the incremental testing.  At each time the code wants to merge to the master branch of remote code repository, our tool will analysis which part of the code is modified, comparing to the existed delivered code via `git diff`.  Then our tool analysis which test cases should or should not be tested. One test case might not be tested since, according to the history record, it did not touch the modified code.

### Purpose
 - When testing the project, determine which tests case are unnecessary and skip those cases. 
 - A test case is no need to test when its covered statements did not appear in `git diff`.

### Workflow
![](https://github.ncsu.edu/DevOps-Milestones/DevOps-M4/blob/master/images/M4-workflow.png)
The image above presents the workflow of the incremental testing toolkit. When developers try to commit their modifications, our toolkit will check the difference between current work directory and last or previous commit via `git diff` command. Then the toolkit finds the touched lines of code, in other words, modified lines of code. According to line modification information, the toolkit looks for the corresponding methods. In the meanwhile, the toolkit has already parsed all existing test cases and found out the touched methods by each test case. The last step is to run only certain test cases instead of the whole test suite.

### Technique Summary
- We used the `diff` tool provided by `git` to find the changes between current work directory and last or previous commit.
- Our analysis unit is the function and we designed this incremental testing toolkit to handle the inner function modification. That is, for one test case, if all of its covered function are not changed in the new commit, it won't be run. On the contrary, it will be tested.
- We used the JS code coverage tool `istanbul` to find which statements one test is covered. Then we wrote scripts to find out which functions these statements are belong to.
- We implemented the visuzlization tool `mochawesome` to show which test cases are actually tested for the modifications in current work directory.

### Technique Details
#### File Structure
```
.
├── checker
│   ├── changed_method_comparator.js
│   ├── commit_changed_method_finder.js
│   ├── get_testcase_id.js
│   ├── git_diff.js
│   ├── method_finder.js
│   ├── package.json
│   ├── README.md
│   ├── test_covered_method_finder_legacy.js
│   └── test_separator_legacy.js
├── images
│   ├── M1-4 workflow.png
│   └── M4-workflow.png
├── pre-commit
├── README.md
├── results
│   ├── commit_changed_method
│   ├── commit_touched_testcases
│   ├── commit_touched_testcases_desc
│   ├── test_case_desc
│   ├── test_covered_method_legacy.csv
│   └── test_covered_methods.json
└── test_covered_method_finder
    ├── Gemfile
    ├── Gemfile.lock
    └── test_covered_method_finder.rb
```
 - Folder `checker` stores the majority of scripts for incremental testing toolkit.
  - Script `changed_method_comparator.js` reads the changed methods information from [commit_changed_method](https://github.ncsu.edu/DevOps-Milestones/DevOps-M4/blob/master/results/commit_changed_method), finds the corresponding test cases from [test_covered_methods.json](https://github.ncsu.edu/DevOps-Milestones/DevOps-M4/blob/master/results/test_covered_methods.json) and writes the filenames of test cases into [commit_touched_testcases](https://github.ncsu.edu/DevOps-Milestones/DevOps-M4/blob/master/results/commit_touched_testcases) file.
  - Script `commit_changed_method_finder.js` requires [git_diff.js](https://github.ncsu.edu/DevOps-Milestones/DevOps-M4/blob/master/checker/git_diff.js), finds the commit changed methods by calling [method_finder.js](https://github.ncsu.edu/DevOps-Milestones/DevOps-M4/blob/master/checker/method_finder.js).
  - Script `get_testcase_id.js` gets the test case filenames from [commit_touched_testcases](https://github.ncsu.edu/DevOps-Milestones/DevOps-M4/blob/master/results/commit_touched_testcases), uses test case descriptions in the format of `test desc 1|test desc 2|test desc 3` and writes into file [commit_touched_testcases_desc](https://github.ncsu.edu/DevOps-Milestones/DevOps-M4/blob/master/results/commit_touched_testcases_desc). The bar-separated format is used for mocha `grep` option.
  - Script `git_diff.js` is able to find the changes between current work directory and last or previous commit.
  - Script `method_finder.js` requires `esprima` to generate AST tree, and finds methods by offering filename and certain line number.
  - Script `test_covered_method_finder_legacy.js` and `test_separator_legacy.js` are two legacy scripts not been used any more.
 - Folder `images` stores images.
 - Script `pre-commit` is a git hook aiming to trigger incremental testing toolkit and a serious of jobs.
 - Folder `results` stores all intermedia and final results
  - File `commit_changed_method` records filename and method names about the modifications of current work directory.
  - File `commit_touched_testcases` stores corresponding test cases of methods mentioned in `commit_changed_method`.
  - File `commit_touched_testcases_desc` records test case descriptions of test cases stored in `commit_touched_testcases`.
  - File `test_case_desc` documents descriptions of all test cases.
  - File `test_covered_methods.json` logs relationships between test cases and methods in the structure of `filename => method name => {test case1, test case2} `.
  - File `test_covered_method_legacy.csv` records above relationships in a deprecated data structure.
 - Folder `test_covered_method_finder` stores ruby script to generate `test_covered_methods.json` and update this file during each commit.

#### `pre-commit` git hook
Below is partial content of this git hook:
```
echo '=====Step1. Find changed methods=========='
node ./commit_changed_method_finder.js

echo '=====Step2. Find touched testcases=========='
node ./changed_method_comparator.js

echo '=====Step3. Get Desc ID corresponding to testcases=========='
node ./get_testcase_id.js
cd ..
CMD=`cat ./results/commit_touched_testcases_desc`
echo $CMD
cd $DIR_APP
A="mocha test/test.js -g \"$CMD\" --reporter mochawesome"
eval $A
echo '=====Step4. Update test covered methods=========='
cd $DIR_M4
cd ./test_covered_method_finder
ruby test_covered_method_finder.rb
```
Basically, this hook executes four steps:
 - The first step is to find the changed methods by executing `commit_changed_method_finder.js` script.
 - The second step is to find the touched test cases according the results of last step and running `changed_method_comparator.js` script.
 - The third step is to obtain the descriptions of test cases by running `get_testcase_id.js` and generate report via `mochawesome`. 
 - The last step is to update `test_covered_methods.json` by executing `test_covered_method_finder.rb` ruby script.

Below is the screenshot of report generated by `mochawesome` with all 30 test cases being ran originally.
![](https://github.ncsu.edu/DevOps-Milestones/DevOps-M4/blob/master/images/30-tests.png)

Below is the screenshot of terminal output of pre-commit hook.
![](https://github.ncsu.edu/DevOps-Milestones/DevOps-M4/blob/master/images/terminal-output.png)

Below is the screenshot of report generated by `mochawesome` with only 2 out of 30 test cases being run by implementing our incremental testing toolkit.
![](https://github.ncsu.edu/DevOps-Milestones/DevOps-M4/blob/master/images/2-tests.png)


### Incremental Testing Toolkit in Whole Pipeline
![](https://github.ncsu.edu/DevOps-Milestones/DevOps-M4/blob/master/images/M1-4%20workflow.png)
This the workflow of the whole pipeline. As you can see our incremental testing toolkit actually occurs before the first milestone. And it executes test cases with higher priority, which saves developers lots of time. And the benefit will be more obvious when implementing out toolkit in a larger project with more test cases.

### Reference
[1] Jiang, Bo, et al. "How well does test case prioritization integrate with statistical fault localization?." Information and Software Technology 54.7 (2012): 739-758.
