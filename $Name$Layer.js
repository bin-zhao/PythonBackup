//
// $comment$
//


/**
 * 初始化、清理，不负责其他逻辑
 *
 */
$namespace$.$Name$Layer = game.IView.extend({

	UI_MAIN		: 'res/UI/$namespace$/Layer$Name$.json',

	__data		: null,
	__root		: null,
	
	
	ctor:function(){
		this._super();

        //cc.log($namespace$.$Name$Layer.DEBUG.format('ctor'));

		this.__data		= game.Facade.getModelData(model.$Model$Model);
		
		this.__root		= ccs.load(this.UI_MAIN).node;
		this.addChild(this.__root);

        var comp        = null;

$switch(btn_back)$
        comp            = this.__root.getChildByName('btn_back');
        if(comp){
            comp.addTouchEventListener(this.__onTouchEvent, this);
        }
$switch(~btn_back)$

$switch(btn_close)$
        comp            = this.__root.getChildByName('btn_close');
        if(comp){
            comp.addTouchEventListener(this.__onTouchEvent, this);
        }
$switch(~btn_close)$

		this.__update();
		
		return true;
	},


    destroy:function(){

    },


    __update:function(){

	},


    __onTouchEvent:function(sender, type){
    	switch(type){
        case ccui.Widget.TOUCH_ENDED:
            switch(sender.name){
$switch(btn_back)$
            case 'btn_back':
                this.send(common.NotifyType.$NAME$_EVENT, {
                    key             : sender.name
                });
                break;
$switch(~btn_back)$

$switch(btn_close)$
            case 'btn_close':
                this.send(common.NotifyType.$NAME$_EVENT, {
                    key             : sender.name
                });
                break;
$switch(~btn_close)$

            default:
$switch(global_event)$
                this.send(common.NotifyType.$NAME$_EVENT, {
                    key             : sender.name
                });
$switch(~global_event)$
                break;
            }
            break;
        }
    },
	
});

/********************************************************************/
/** static **/
/********************************************************************/

$namespace$.$Name$Layer.DEBUG							= '## $namespace$.$Name$Layer.{0}: ';

$switch(mediator)$
/********************************************************************/
/** mediator **/
/********************************************************************/

$namespace$.$Name$LayerMediator		= game.LayerMediator.extend({


	ctor:function(view){
		this._super(view, true);

        //cc.log($namespace$.$Name$LayerMediator.DEBUG.format('ctor'));
	},


	init:function (){
		tools.UIUtils.AutoClearManager.getInstance().addSubscribe('$Name$LayerMediator',
			common.NotifyType.$NAME$_EVENT, this.__on$Name$Event, this);
	},


	show:function(parent){
		this._super(parent);
		parent.addChild(this.currLayer);
	},


	freshen:function(){

	},


	destroy:function(){
		tools.UIUtils.AutoClearManager.getInstance().removeAll('$Name$LayerMediator');
	},


    __on$Name$Event:function(obj, unusedTarget){
        switch(obj.key){
$switch(btn_back)$
        case 'btn_back':
            this.popLayer(this);
            break;
$switch(~btn_back)$

$switch(btn_close)$
        case 'btn_close':
            this.popLayer(this, true);
            break;
$switch(~btn_close)$

        default:
            break;
        }
    },

});

/********************************************************************/
/** static **/
/********************************************************************/

$namespace$.$Name$LayerMediator.DEBUG							= '## $namespace$.$Name$LayerMediator.{0}: ';
$switch(~mediator)$