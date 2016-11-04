/**
 * Created by 乐杰 on 2016/9/22.
 */
angular.module("app.subjectModule",["ng"])
      .controller("subjectController",["$scope","$rootScope","subjectService","commentService","screenFilter","xuanzeFilter","$routeParams","$location",
          function ($scope,$rootScope,subjectService,commentService,screenFilter,xuanzeFilter,$routeParams,$location) {
          //通过路由传参数(封装对象)
          $scope.params=$routeParams;
           var subjectModel=(function () {
                  var obj={};
                 if($scope.params.typeId!=0){
                    obj['subject.subjectType.id']=$scope.params.typeId;
                 }
                 if($scope.params.depId!=0){
                     obj['subject.department.id']=$scope.params.depId;
                 }
                 if($scope.params.topId!=0){
                     obj['subject.topic.id']=$scope.params.topId;
                 }
                 if($scope.params.lelId!=0){
                     obj['subject.subjectLevel.id']=$scope.params.lelId;
                 }
                 return obj;
              })();
          $scope.arr=["A","B","C","D","E","F"];
          //根据输入内容过滤题目
          $scope.src={
              key:"stem"
          };
          $scope.chaxun=function () {
              subjectService.getAllSubjects($scope.src,function (data) {
                  var result=screenFilter(data,$scope.src);
                  //将答案转化为字母。
                  result.forEach(function (item) {
                      var answer=[];
                      for(var i=0;i<item.answer.length;i++){
                          var t=item.answer.charAt(i);
                          answer.push($scope.arr[t]);
                          i=i+1;
                      }
                       item.answer=answer.toString();
                  });
                  $scope.subjects=result;
              });
          };
          //获取题型
          commentService.getType(function (data) {
              $scope.types=data;
          });
          //获取方向
          commentService.getDepartment(function (data) {
              $scope.deps=data;
          });
          //获取知识点(题目管理联动)
          commentService.getTopics(function (data) {
              if($scope.params.depId!=0){
                  var arr=[];
                  data.forEach(function (item) {
                    if(item.department.id==$scope.params.depId){
                       arr.push(item);
                    }
                  });
                  $scope.tops=arr;
              }else{
                  $scope.tops=data;
              }
          });
          //获取题目难度级别
          commentService.getLevel(function (data) {
              $scope.levels=data;
          });
              //获取知识点(添加题目联动)
          commentService.getTopics(function (data) {
                  $scope.topss=data;
              });
         //获取所有题目信息
          subjectService.getAllSubjects(subjectModel,function (data) {
              //设置正确答案
               data.forEach(function (subject) {
                   var answer=[];
                   if(subject.subjectType && subject.subjectType.id!=3){
                       subject.choices.forEach(function (choices,index) {
                           if(choices.correct){
                               answer.push($scope.arr[index]);
                           }
                       });
                       subject.answer=answer.toString();
                   }
               });
               $scope.subjects=data;
          });
 //添加单个题目的功能
             var upLoadTime=new Date();
             var a=upLoadTime.getYear()-100+2000;
             var b=upLoadTime.getMonth()+1;
             var c=upLoadTime.getDate();
                  upLoadTime=a+"-"+b+"-"+c;
              //获取题目信息
              $scope.subject={
                  typeId:1,
                  depId:1,
                  topId:1,
                  lelId:1,
                  choiceContent:[],
                  upLoadTime:upLoadTime
              };
              $scope.saveOne=function () {
                  var choiceCorrect=xuanzeFilter($(".Answerpart_left input"));
                  $scope.subject.choiceCorrect=choiceCorrect;
                  subjectService.saveSubject($scope.subject,function () {
                      alert("保存成功");
                  });
                  $location.url("/subjectManager/subjectAdd");
              };
              $scope.saveTwo=function () {
                  var choiceCorrect=xuanzeFilter($(".Answerpart_left input"));
                  $scope.subject.choiceCorrect=choiceCorrect;
                  subjectService.saveSubject($scope.subject,function () {
                      alert("保存成功");
                  });
                  $location.url("/subjectManager/typeId/0/depId/0/topId/0/lelId/0");
              };
   //审核和删除题目
                  if($scope.params.subjectId){
                          op();
                  }
              function op(){
                  if($scope.params.checkState==0){
                      var del=confirm("确认删除题号为"+$scope.params.subjectId+"的试题吗？");
                      if(del){
                      subjectService.deleteSubject($scope.params.subjectId);
                      }
                  }
                  else if($scope.params.checkState!=0){
                      var obj={};
                      obj["subject.id"]=$scope.params.subjectId;
                      obj["subject.checkState"]=$scope.params.checkState;
                      subjectService.checkSubject(obj);
                  }
              }


      }])
      //对题目信息进行操作的服务
      .factory("commentService",["$http",function ($http) {
        return {
            getType: function (handle) {
                $http({
                    method: "post",
                    // url:"data/types.json",
                   url: "http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action",
                    cache: true
                }).success(function (data) {
                    handle(data);
                });
            },
            getDepartment: function (handle) {
                 $http.get("data/direction.json")
                    //跨域
                 /* $http.jsonp("http://172.16.0.5:7777/test/exam/manager/getAllDepartment.action",
                    {
                      params:{
                          callback:"JSON_CALLBACK"
                      }
                   })*/
                    .success(function (data) {
                        handle(data);
                    });
            },
            getTopics:function (handle) {
                // $http.post("data/knowledge.json")
                $http.post("http://172.16.0.5:7777/test/exam/manager/getAllTopics.action")
                    .success(function (data) {
                        handle(data);
                    });
            },
            getLevel: function (handle) {
                $http({
                    method: "get",
                    // url:"data/difficulty.json",
                   url: "http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action",
                    cache: true
                }).success(function (data) {
                    handle(data);
                });
            }
        };
}])
    //对题目进行操作的服务
    .service("subjectService",["$http","$httpParamSerializer",function ($http,$httpParamSerializer) {
       this.getAllSubjects=function (params,handler) {
           $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action",{params:params})
           // $http.get("data/question.json",{params:params})
           .success(function (data) {
                 handler(data);
           });
       };
       this.saveSubject=function (subject,handler) {
           //处理参数，将参数转化为angular需要的数据格式
           var obj={};
            for(var key in subject){
                var val=subject[key];
                switch (key){
                    case "typeId": obj["subject.subjectType.id"]=val;break;
                    case "depId": obj["subject.department.id"]=val;break;
                    case "topId": obj["subject.topic.id"]=val;break;
                    case "lelId": obj["subject.subjectLevel.id"]=val;break;
                    case "stem": obj["subject.stem"]=val;break;
                    case "answer": obj["subject.answer"]=val;break;
                    case "analysis": obj["subject.analysis"]=val;break;
                    case "choiceContent": obj["choiceContent"]=val;break;
                    case "choiceCorrect": obj["choiceCorrect"]=val;break;
                }
            }
            //将文件格式转换为表单
           obj=$httpParamSerializer(obj);
            $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",
               obj,{
                headers:{
                    "Content-Type": "application/x-www-form-urlencoded",
                  }
                }).success(function (data) {
                handler(data);
            });

       };
       this.deleteSubject=function(subjectId){
           var obj={};
           obj["subject.id"]=subjectId;
           obj=$httpParamSerializer(obj);
           console.log(obj);
           $http.post("http://172.16.0.5:7777/test/exam/manager/delSubject.action",
               obj,{
                   headers:{
                       "Content-Type": "application/x-www-form-urlencoded",
                   }
               })
               .success(function (data) {
                   alert(data);
               });
       };
        this.checkSubject=function(obj){
            obj=$httpParamSerializer(obj);
            console.log(obj);
            $http.post("http://172.16.0.5:7777/test/exam/manager/checkSubject.action",
                obj,{
                    headers:{
                        "Content-Type": "application/x-www-form-urlencoded",
                    }
                })
                .success(function (data) {
                    alert(data);
                });
        };
}])
        //更改答案选项。
    .directive("changeAnswer",[function () {
        return function (scope,element) {
             element.change(function (event) {
                 if(scope.subject.typeId==3){
                     $(".Answeroptions").hide();
                     $(".Problem.chapterAnswer").show();
                 }else{
                     $(".Answeroptions").show();
                     $(".Problem.chapterAnswer").hide();
                     if(scope.subject.typeId==1){
                         $(".Answerpart_left input").attr("type","radio");
                     }else{
                         $(".Answerpart_left input").attr("type","checkbox");
                     }
                 }
             });

        };
    }])
    //过滤器实现筛选查找
    .filter("screen",[function () {
      return function (input,index) {
          var result=[];
              input.forEach(function (item) {
                  //设置答案
                  var answer=[];
                  if(item.subjectType && item.subjectType.id!=3){
                      item.choices.forEach(function (choices,index) {
                          if(choices.correct){
                              answer.push(index);//此时返回的是数字。
                          }
                      })
                  }
                  item.answer=answer.toString();
                  //筛选符合条件的题目
                var str1=item.stem;
                var str2=index.value;
                var str3=[];
                item.choices.forEach(function (item) {
                   str3.push(item.content);
                });
                 str3= str3.toString();
              if(index.key=="stem" && str1.indexOf(str2)>=0){
                 result.push(item);
              }else if(index.key=="choices" && str3.indexOf(str2)>=0){
                  result.push(item);
              }
          });
              return result;
      };
}])
    //获取选择题答案
    .filter("xuanze",function () {
        return function (input) {
            var arr=[];
            input.each(function (index,item) {
                if(item.checked){
                    arr[index]="true";
                }else{
                    arr[index]="false";
                };
            });
            return arr;
            };
    })
    //过滤添加页面的知识点
    .filter("selectTopic",function () {
        return function (input,id) {
            if(input){
                return input.filter(function (item) {
                        return item.department.id==id;
                });
            }
        }

    })
;
