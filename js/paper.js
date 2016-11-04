/**
 * Created by 乐杰 on 2016/9/28.
 */
angular.module("app.paperModule",["ng","app.subjectModule"])
    .controller("paperListCtrl",["$scope","paperService",
        function ($scope,paperService) {
        //获取所有试卷信息
          paperService.getAllpapers(function (data) {
              $scope.papers=data;
         });
    }])
    .controller("paperAddCtrl",["$scope","commentService","paperService","paperAddService","$routeParams",
        function ($scope,commentService,paperService,paperAddService,$routeParams) {
        //查询所有方向。
        commentService.getDepartment(function (data) {
            $scope.deps=data;
        });
            $scope.model = paperAddService.model
        //添加题目
        if($routeParams.id!=0){
            paperAddService.addSubjectsID($routeParams.id);
            paperService.getAllSubject(function (data) {
              data.forEach(function (item) {
                  if(item.id==$routeParams.id){
                      paperAddService.addSubject(item);
                  }
              });
          });
        }
        //提交组装试卷
    $scope.savePaper=function () {
        paperService.savePaper($scope.model,function (data) {
            console.log(data);
        })
        };
    //计算试卷总分
            $("tbody").change(function () {
                if($scope.model.scores.length!=0){
                    $scope.model.totalPoints=0;
                    $scope.model.scores.forEach(function (item) {
                        $scope.model.totalPoints=item+$scope.model.totalPoints;
                    })
                }
            });
    }])

    //试卷服务
    .service("paperService",["$http","$httpParamSerializer",function ($http,$httpParamSerializer) {
        this.getAllpapers=function (handler) {
            $http.get("http://172.16.0.5:7777/test/exam/manager/getAllExamPapers.action")
                .success(function (data) {
                    console.log(data);
                    handler(data);
                });
        };
        this.getAllSubject=function (handler) {
            $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action")
            // $http.get("data/question.json",{params:params})
                .success(function (data) {
                    handler(data);
                });
        };
        this.savePaper=function (paper,handler) {
            var obj={};
             obj["paper.title"]=paper.title;
            obj["paper.description"]=paper.description;
            obj["paper.department.id"]=paper.depId;
            obj["paper.totalPoints"]=paper.totalPoints;
            obj["paper.answerQuestionTime"]=paper.answerQuestionTime;
            obj["scores"]=paper.scores;
            obj["subjectIds"]=paper.subjectsID;
            obj=$httpParamSerializer(obj);
            $http.get("http://172.16.0.5:7777/test/exam/manager/saveExamPaper.action",
            obj,{
                headers:{
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            }).success(function (data) {
                    handler(data);
                });
        }
    }])
    .factory("paperAddService",[function () {
        return {
            model:{
            depId:1,
            totalPoints:0,
            subjectsID:[],
            paperSubjects:[],
            scores:[]
            },
            addSubjectsID:function (id) {
                this.model.subjectsID.push(id);
            },
            addSubject:function (subject) {
                this.model.paperSubjects.push(subject);
            },
        };
    }]);
