//
// 游戏公告2（定制）
//


/**
 * 初始化、清理，不负责其他逻辑
 *
 */
role.Announce2Layer = game.IView.extend({

	UI_MAIN		: 'res/UI/role/LayerAnnounce2.json',

	__data		: null,
	__root		: null,
	
	
	ctor:function(){
		this._super();

        //cc.log(role.Announce2Layer.DEBUG.format('ctor'));

		this.__data		= game.Facade.getModelData(model.RoleModel);
		
		this.__root		= ccs.load(this.UI_MAIN).node;
		this.addChild(this.__root);

        var comp        = null;

        comp            = this.__root.getChildByName('btn_close');
        if(comp){
            comp.addTouchEventListener(this.__onTouchEvent, this);
        }

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
            case 'btn_close':
                this.send(common.NotifyType.ANNOUNCE2_EVENT, {
                    key             : sender.name
                });
                break;

            default:
                break;
            }
            break;
        }
    },
	
});

/********************************************************************/
/** static **/
/********************************************************************/

role.Announce2Layer.DEBUG							= '## role.Announce2Layer.{0}: ';

/********************************************************************/
/** mediator **/
/********************************************************************/

role.Announce2LayerMediator		= game.LayerMediator.extend({


	ctor:function(view){
		this._super(view, true);

        //cc.log(role.Announce2LayerMediator.DEBUG.format('ctor'));
	},


	init:function (){
		tools.UIUtils.AutoClearManager.getInstance().addSubscribe('Announce2LayerMediator',
			common.NotifyType.ANNOUNCE2_EVENT, this.__onAnnounce2Event, this);
	},


	show:function(parent){
		this._super(parent);
		parent.addChild(this.currLayer);
	},


	freshen:function(){

	},


	destroy:function(){
		tools.UIUtils.AutoClearManager.getInstance().removeAll('Announce2LayerMediator');
	},


    __onAnnounce2Event:function(obj, unusedTarget){
        switch(obj.key){
        case 'btn_close':
            this.popLayer(this, true);
            break;

        default:
            break;
        }
    },

});

/********************************************************************/
/** static **/
/********************************************************************/

role.Announce2LayerMediator.DEBUG							= '## role.Announce2LayerMediator.{0}: ';
