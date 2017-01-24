/*瀑布流效果*/
var waterfall = function(){
    //首先是对demo结构进行操作
    if($(window).width() <= 1024 && $(window).width() > 767){
        $(".element").eq(3).remove();
    }else if($(window).width() <= 767 && $(window).width() > 540){
        $(".element").eq(3).remove();
        $(".element").eq(2).remove();
    }else if($(window).width() <= 540 ){
        $(".element").eq(3).remove();
        $(".element").eq(2).remove();
        $(".element").eq(1).remove();
    }
    
    $.getJSON("../../life/diary.json",function(data){
        for(var i=0;i<data.length;i++){
            //获取高度最小的child
            var _index = getShort();
            var child = $('<div></div>');
            
            var image = $('<a/a>');
            image.attr("href", data[i].url );

            var image3 = $('<img/>');
            image3.attr("src",data[i].src);

            image.append(image3);

            if(window.innerWidth >= 768){
                image.css({"width":"214px","height":data[i].height * ( 2214 / data[i].width ) + 'px'})
            }
            child.append( image );

            
            var description = $("<center></center>");
            description.text(data[i].des);
          
            child.append( description );
            $(".element").eq(_index).append( child );
        }

        var elementHArr=[];
        console.log( $(".element").eq( 0 ).height())  
        $(".element").each( function( index, value ){
            elementHArr[ index ] = $(".element").eq( index ).height(); 
            console.log( $(".element").eq( index ).height())      
        });

        var maxH = Math.max.apply( null, elementHArr );
        console.log(maxH)
        $(".demo").css("height",maxH +"px");
    }) 
};
/**
 * 获取高度最小的child,瀑布流布局时使用
 * @return {[type]} [description]
 */
function getShort(){
    var index = 0;
    var min = $(".element").eq(index).height();
    $(".element").each(function(i){
        if($(this).height() < min){
            index = i;
            min = $(this).height();
        }
    });
    return index;
};

waterfall();