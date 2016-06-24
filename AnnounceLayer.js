//
// 游戏公告（默认）
//


/**
 * 初始化、清理，不负责其他逻辑
 *
 */
role.AnnounceLayer = game.IView.extend({

	UI_MAIN		: 'res/UI/role/LayerAnnounce.json',

	__data		: null,
	__root		: null,
	
	
	ctor:function(){
		this._super();

        //cc.log(role.AnnounceLayer.DEBUG.format('ctor'));

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
                this.send(common.NotifyType.ANNOUNCE_EVENT, {
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

role.AnnounceLayer.DEBUG							= '## role.AnnounceLayer.{0}: ';

/********************************************************************/
/** mediator **/
/********************************************************************/

role.AnnounceLayerMediator		= game.LayerMediator.extend({


	ctor:function(view){
		this._super(view, true);

        //cc.log(role.AnnounceLayerMediator.DEBUG.format('ctor'));
	},


	init:function (){
		tools.UIUtils.AutoClearManager.getInstance().addSubscribe('AnnounceLayerMediator',
			common.NotifyType.ANNOUNCE_EVENT, this.__onAnnounceEvent, this);
	},


	show:function(parent){
		this._super(parent);
		parent.addChild(this.currLayer);
	},


	freshen:function(){

	},


	destroy:function(){
		tools.UIUtils.AutoClearManager.getInstance().removeAll('AnnounceLayerMediator');
	},


    __onAnnounceEvent:function(obj, unusedTarget){
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

role.AnnounceLayerMediator.DEBUG							= '## role.AnnounceLayerMediator.{0}: ';
