 //main.html页面功能

 $(function () {
     //隐藏所有
     $(".baseUI>li>ul").slideUp("fast");
     //点击打开
     $(".baseUI>li>a").off("click");
     $(".baseUI>li>a").on("click",function () {
         $(".baseUI>li>ul").slideUp();
         $(this).next().slideDown();
     });
     //默认显示第一个
     $(".baseUI>li>ul").eq(0).stop().slideDown();
     $(".baseUI ul>li").eq(0).find("a").trigger("click");
     //点击切换选中项背景并在右侧打开对于页面
     $(".baseUI ul>li").off("click");
     $(".baseUI ul>li").on("click",function () {
         if(!$(this).hasClass("current")){
             $(".baseUI ul>li").removeClass("current");
             $(this).addClass("current");
         }
     });
 });
 //项目的核心模块
 //li点击切换
angular.module("app",["ng","ngRoute","app.subjectModule","app.paperModule"])
       .controller("mainCtrl",["$scope",function ($scope) {

       }]).config(["$routeProvider",function ($routeProvider) {
         $routeProvider.when("/subjectList/typeId/:typeId/depId/:depId/topId/:topId/lelId/:lelId",{
             templateUrl:"tpl/subject/subjectList.html",
             controller:"subjectController"
         }).when("/subjectManager/typeId/:typeId/depId/:depId/topId/:topId/lelId/:lelId",{
             templateUrl:"tpl/subject/subjectManager.html",
             controller:"subjectController"
         }).when("/subjectManager/subjectAdd/",{
             templateUrl:"tpl/subject/subjectAdd.html",
             controller:"subjectController"
         }).when("/subjectManager/typeId/:typeId/depId/:depId/topId/:topId/lelId/:lelId/subjectId/:subjectId/checkState/:checkState",{
             templateUrl:"tpl/subject/subjectManager.html",
             controller:"subjectController"
         }).when("/paperManager",{
             templateUrl:"tpl/paper/paperManager.html",
             controller:"paperListCtrl"
         }).when("/paperAdd",{
             templateUrl:"tpl/paper/paperAdd.html",
             controller:"paperAddCtrl"
         }).when("/paperAdd/addSubject/typeId/:typeId/depId/:depId/topId/:topId/lelId/:lelId",{
             templateUrl:"tpl/subject/subjectList.html",
             controller:"paperAddCtrl"
         }).when("/paperAdd/sub/id/:id",{
             templateUrl:"tpl/paper/paperAdd.html",
             controller:"paperAddCtrl"
         })
       }]);


