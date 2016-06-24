var game=game||{},server=server||{};
game.Frameworks={DEBUG:!1,LOG_TAG:"DEBUG",IS_RUNTIME:!1,NET_TYPE:1,DESIGN_ZOOM:1,DEVICE_ID:"DEVICE_ID"};
game._Log={};
game._Log.debugArray=[];
game._Log.tagArray=[];
game.log=function(a,b){"RELEASE"!=b&&(void 0==b&&"DEBUG"==game.Frameworks.LOG_TAG?(cc.log("game: "+a),game._Log.debugArray.push("game:"+a)):b==game.Frameworks.LOG_TAG&&(cc.log(b+": "+a),game._Log.tagArray.push(b+":"+a)))};

game.createLogFile=function(a){var b="";
if(void 0==a){for(a=0;
a<game._Log.debugArray.length;
a++)b+=game._Log.debugArray[a]+"\n";
jsb.fileUtils.writeToFile({key:b},"DEBUG_LOG.txt")}else if(a==game.Frameworks.LOG_TAG){for(a=0;
a<game._Log.tagArray.length;
a++)b+=game._Log.tagArray[a]+"\n";
jsb.fileUtils.writeToFile({content:b},game.Frameworks.LOG_TAG+"_LOG.txt")}};
game.Facade=function(){return new _Facade}();
function _Facade(){game.log("Facade init.")}game.Facade._directorMediator=null;

game.Facade._modelMap=null;
game.Facade.zoom=1;
game.Facade.init=function(a,b,c,d){game.Frameworks.IS_RUNTIME=a;
game.Frameworks.NET_TYPE=b;
game.Facade._directorMediator=new game.DirectorMediator;
game.Facade._modelMap=new game.Map;
b=cc.winSize;
a=b.width/c.width;
c=b.height/c.height;
game.Facade.zoom=a<c?a:c;
game.Frameworks.DESIGN_ZOOM=a<c?a:c;
void 0!=d&&(game.Frameworks.LOG_TAG=d)};

game.Facade.registerModel=function(a,b){b.subscribe();
game.Facade._modelMap.contains(a)?game.log("\u5df2\u5b58\u5728\u7684model:"+a):game.Facade._modelMap.put(a,b)};
game.Facade.getCurrMediator=function(){var a=game.Facade._directorMediator.currSceneMediator.currLayerMediator;
null==a&&(a=game.Facade._directorMediator.currSceneMediator.rootLayerMediator);
return a};
game.Facade.getRootMediator=function(){return game.Facade._directorMediator.currSceneMediator.rootLayerMediator};
game.Facade.getModel=function(a){return game.Facade._modelMap.get(a)};

game.Facade.showScene=function(a){game.Facade._directorMediator.showScene(a);
game.Facade._directorMediator.currSceneMediator.showRoot()};
game.Facade.pushScene=function(a){game.Facade._directorMediator.pushScene(a);
game.Facade._directorMediator.currSceneMediator.showRoot()};
game.Facade.popScene=function(){game.Facade._directorMediator.popScene()};
game.Facade.showLayer=function(a,b){game.Facade._directorMediator.currSceneMediator.showLayer(a,b)};

game.Facade.pushLayer=function(a,b){game.Facade._directorMediator.currSceneMediator.pushLayer(a,b)};
game.Facade.popLayer=function(a){game.Facade._directorMediator.currSceneMediator.popLayer(a)};
game.TweenEnum={SCALE:1,TOP:2,DOWN:3,LEFT:4,RIGHT:5,FADE:6};
game.CommonEnum={FAIL:0,SUCC:1};
game.NetType={LOCAL:1,WS:2};
game.LocalData={DEFAULT:0,CUSTOM:1,UUID:2};

game.Map=cc.Class.extend({elements:null,ctor:function(){this.elements=[]},put:function(a,b){this.contains(a)&&this.remove(a);
this.elements.push({key:a,value:b})},get:function(a){try{for(i=0;
i<this.elements.length;
i++)if(this.elements[i].key==a)return this.elements[i].value}catch(b){return null}},remove:function(a){var b=!1;
try{for(i=0;
i<this.elements.length;
i++)if(this.elements[i].key==a)return this.elements.splice(i,1),!0}catch(c){b=!1}return b},contains:function(a){var b=!1;
try{for(i=0;
i<this.elements.length;
i++)this.elements[i].key==
a&&(b=!0)}catch(c){b=!1}return b},size:function(){return this.elements.length},isEmpty:function(){return 1>this.elements.length},clear:function(){this.elements=[]}});

game.Stack=cc.Class.extend({elements:null,ctor:function(){this.elements=[]},push:function(a){if(0==a.length)return-1;
this.elements.push(a);
return this.elements.length},pop:function(){return 0>=this.elements.length?null:this.elements.pop()},top:function(){return 0>=this.elements.length?null:this.elements[this.elements.length-1]},size:function(){return this.elements.length},isEmpty:function(){return 0<this.elements.length?!1:!0},clear:function(){this.elements=[]}});

game.IMediator	= cc.Class.extend(
	{
		ctor:function(){},
		show:function(){throw Error("\u5b50\u7c7b\u672a\u5b9e\u73b0subscribe\u65b9\u6cd5.");}
	}
);

game.IModel=cc.Class.extend({ctor:function(){},subscribe:function(){throw Error("\u5b50\u7c7b\u672a\u5b9e\u73b0subscribe\u65b9\u6cd5.");
}});

var SocketManager={address:"",callbackMap:null,session:"",_isInit:!1,_obj:null,_error:null,init:function(a,b){game.Frameworks.NET_TYPE==game.NetType.LOCAL?(game.LocalStoreManager.init(),SocketManager.callbackMap=new game.Map,SocketManager._isInit=!0):game.Frameworks.NET_TYPE==game.NetType.WS&&(SocketManager.address=a,SocketManager._error=b,SocketManager.callbackMap=new game.Map,SocketManager._isInit=!0)},register:function(a,b){!1==SocketManager._isInit?game.log("SocketManager doesn't init!"):SocketManager.callbackMap.put(a,
b)},unregister:function(a){SocketManager.callbackMap.remove(a)},clearRegister:function(){SocketManager.callbackMap.clear()},send:function(a){if(game.Frameworks.NET_TYPE==game.NetType.LOCAL)game.LocalStoreManager.requestHandler(a);
else if(!1==SocketManager._isInit)game.log("SocketManager doesn't init!");
else{a.sid=SocketManager.session;
SocketManager._obj=a;
var b=new WebSocket(SocketManager.address);
b.onopen=function(b){b=JSON.stringify(a);
game.log("request text msg: "+b);
this.send(b)};
b.onerror=function(a){game.log("sendText Error was fired!");

null!=SocketManager._error&&void 0!=SocketManager._error&&SocketManager._error(a);
this.close()};
b.onclose=function(a){game.log("_wsiSendText websocket instance closed.");
this.close()};
b.onmessage=function(a){game.log("response text msg: "+a.data);
SocketManager.prase(a.data);
this.close()}}},reSend:function(){SocketManager.send(SocketManager._obj)},prase:function(a){game.log(a,"MESSAGES");
a=JSON.parse(a);
for(var b=0;
b<a.length;
b++){var c=SocketManager.callbackMap.get(a[b].pid);
void 0!=c&&null!=c&&c(a[b])}}};

game.DirectorMediator=game.IMediator.extend({sceneMediatorStack:null,currSceneMediator:null,ctor:function(a){this.currView=a;
this.sceneMediatorStack=new game.Stack},show:function(a){},showScene:function(a){this.currSceneMediator&&this.currSceneMediator.rootLayerMediator&&this.currSceneMediator.rootLayerMediator._pDispose();
if(this.currSceneMediator)for(var b=this.currSceneMediator.layerMediatorList;
0<b.size();
)b.pop()._pDispose();
this.currSceneMediator=a;
this.sceneMediatorStack=new game.Stack;
this.sceneMediatorStack.push(a);

cc.director.runScene(a.currScene)},pushScene:function(a){this.currSceneMediator=a;
this.sceneMediatorStack.push(a);
cc.director.pushScene(a.currScene)},popScene:function(){this.sceneMediatorStack.pop();
this.currSceneMediator=this.sceneMediatorStack.top();
cc.director.popScene()}});

game.SceneMediator=game.IMediator.extend({currScenvar game = game || {},
server = server || {};
game.Frameworks = {
    DEBUG: !1,
    LOG_TAG: "DEBUG",
    IS_RUNTIME: !1,
    NET_TYPE: 1,
    DESIGN_ZOOM: 1,
    DEVICE_ID: "DEVICE_ID"
};
game._Log = {};
game._Log.debugArray = [];
game._Log.tagArray = [];
game.log = function(a, b) {
    "RELEASE" != b && (void 0 == b && "DEBUG" == game.Frameworks.LOG_TAG ? (cc.log("game: " + a), game._Log.debugArray.push("game:" + a)) : b == game.Frameworks.LOG_TAG && (cc.log(b + ": " + a), game._Log.tagArray.push(b + ":" + a)))
};
game.createLogFile = function(a) {
    var b = "";
    if (void 0 == a) {
        for (a = 0; a < game._Log.debugArray.length; a++) b += game._Log.debugArray[a] + "\n";
        jsb.fileUtils.writeToFile({
            key: b
        },
        "DEBUG_LOG.txt")
    } else if (a == game.Frameworks.LOG_TAG) {
        for (a = 0; a < game._Log.tagArray.length; a++) b += game._Log.tagArray[a] + "\n";
        jsb.fileUtils.writeToFile({
            content: b
        },
        game.Frameworks.LOG_TAG + "_LOG.txt")
    }
};
game.Facade = function() {
    return new _Facade
} ();
function _Facade() {
    game.log("Facade init.")
}
game.Facade._directorMediator = null;
game.Facade._modelMap = null;
game.Facade.zoom = 1;
game.Facade.init = function(a, b, c, d) {
    game.Frameworks.IS_RUNTIME = a;
    game.Frameworks.NET_TYPE = b;
    game.Facade._directorMediator = new game.DirectorMediator;
    game.Facade._modelMap = new game.Map;
    b = cc.winSize;
    a = b.width / c.width;
    c = b.height / c.height;
    game.Facade.zoom = a < c ? a: c;
    game.Frameworks.DESIGN_ZOOM = a < c ? a: c;
    void 0 != d && (game.Frameworks.LOG_TAG = d)
};
game.Facade.registerModel = function(a, b) {
    b.subscribe();
    game.Facade._modelMap.contains(a) ? game.log("\u5df2\u5b58\u5728\u7684model:" + a) : game.Facade._modelMap.put(a, b)
};
game.Facade.getCurrMediator = function() {
    var a = game.Facade._directorMediator.currSceneMediator.currLayerMediator;
    null == a && (a = game.Facade._directorMediator.currSceneMediator.rootLayerMediator);
    return a
};
game.Facade.getRootMediator = function() {
    return game.Facade._directorMediator.currSceneMediator.rootLayerMediator
};
game.Facade.getModel = function(a) {
    return game.Facade._modelMap.get(a)
};
game.Facade.showScene = function(a) {
    game.Facade._directorMediator.showScene(a);
    game.Facade._directorMediator.currSceneMediator.showRoot()
};
game.Facade.pushScene = function(a) {
    game.Facade._directorMediator.pushScene(a);
    game.Facade._directorMediator.currSceneMediator.showRoot()
};
game.Facade.popScene = function() {
    game.Facade._directorMediator.popScene()
};
game.Facade.showLayer = function(a, b) {
    game.Facade._directorMediator.currSceneMediator.showLayer(a, b)
};
game.Facade.pushLayer = function(a, b) {
    game.Facade._directorMediator.currSceneMediator.pushLayer(a, b)
};
game.Facade.popLayer = function(a) {
    game.Facade._directorMediator.currSceneMediator.popLayer(a)
};
game.TweenEnum = {
    SCALE: 1,
    TOP: 2,
    DOWN: 3,
    LEFT: 4,
    RIGHT: 5,
    FADE: 6
};
game.CommonEnum = {
    FAIL: 0,
    SUCC: 1
};
game.NetType = {
    LOCAL: 1,
    WS: 2
};
game.LocalData = {
    DEFAULT: 0,
    CUSTOM: 1,
    UUID: 2
};
game.Map = cc.Class.extend({
    elements: null,
    ctor: function() {
        this.elements = []
    },
    put: function(a, b) {
        this.contains(a) && this.remove(a);
        this.elements.push({
            key: a,
            value: b
        })
    },
    get: function(a) {
        try {
            for (i = 0; i < this.elements.length; i++) if (this.elements[i].key == a) return this.elements[i].value
        } catch(b) {
            return null
        }
    },
    remove: function(a) {
        var b = !1;
        try {
            for (i = 0; i < this.elements.length; i++) if (this.elements[i].key == a) return this.elements.splice(i, 1),
            !0
        } catch(c) {
            b = !1
        }
        return b
    },
    contains: function(a) {
        var b = !1;
        try {
            for (i = 0; i < this.elements.length; i++) this.elements[i].key == a && (b = !0)
        } catch(c) {
            b = !1
        }
        return b
    },
    size: function() {
        return this.elements.length
    },
    isEmpty: function() {
        return 1 > this.elements.length
    },
    clear: function() {
        this.elements = []
    }
});
game.Stack = cc.Class.extend({
    elements: null,
    ctor: function() {
        this.elements = []
    },
    push: function(a) {
        if (0 == a.length) return - 1;
        this.elements.push(a);
        return this.elements.length
    },
    pop: function() {
        return 0 >= this.elements.length ? null: this.elements.pop()
    },
    top: function() {
        return 0 >= this.elements.length ? null: this.elements[this.elements.length - 1]
    },
    size: function() {
        return this.elements.length
    },
    isEmpty: function() {
        return 0 < this.elements.length ? !1 : !0
    },
    clear: function() {
        this.elements = []
    }
});
game.IMediator = cc.Class.extend({
    ctor: function() {},
    show: function() {
        throw Error("\u5b50\u7c7b\u672a\u5b9e\u73b0subscribe\u65b9\u6cd5.");
    }
});
game.IModel = cc.Class.extend({
    ctor: function() {},
    subscribe: function() {
        throw Error("\u5b50\u7c7b\u672a\u5b9e\u73b0subscribe\u65b9\u6cd5.");
    }
});
var SocketManager = {
    address: "",
    callbackMap: null,
    session: "",
    _isInit: !1,
    _obj: null,
    _error: null,
    init: function(a, b) {
        game.Frameworks.NET_TYPE == game.NetType.LOCAL ? (game.LocalStoreManager.init(), SocketManager.callbackMap = new game.Map, SocketManager._isInit = !0) : game.Frameworks.NET_TYPE == game.NetType.WS && (SocketManager.address = a, SocketManager._error = b, SocketManager.callbackMap = new game.Map, SocketManager._isInit = !0)
    },
    register: function(a, b) { ! 1 == SocketManager._isInit ? game.log("SocketManager doesn't init!") : SocketManager.callbackMap.put(a, b)
    },
    unregister: function(a) {
        SocketManager.callbackMap.remove(a)
    },
    clearRegister: function() {
        SocketManager.callbackMap.clear()
    },
    send: function(a) {
        if (game.Frameworks.NET_TYPE == game.NetType.LOCAL) game.LocalStoreManager.requestHandler(a);
        else if (!1 == SocketManager._isInit) game.log("SocketManager doesn't init!");
        else {
            a.sid = SocketManager.session;
            SocketManager._obj = a;
            var b = new WebSocket(SocketManager.address);
            b.onopen = function(b) {
                b = JSON.stringify(a);
                game.log("request text msg: " + b);
                this.send(b)
            };
            b.onerror = function(a) {
                game.log("sendText Error was fired!");
                null != SocketManager._error && void 0 != SocketManager._error && SocketManager._error(a);
                this.close()
            };
            b.onclose = function(a) {
                game.log("_wsiSendText websocket instance closed.");
                this.close()
            };
            b.onmessage = function(a) {
                game.log("response text msg: " + a.data);
                SocketManager.prase(a.data);
                this.close()
            }
        }
    },
    reSend: function() {
        SocketManager.send(SocketManager._obj)
    },
    prase: function(a) {
        game.log(a, "MESSAGES");
        a = JSON.parse(a);
        for (var b = 0; b < a.length; b++) {
            var c = SocketManager.callbackMap.get(a[b].pid);
            void 0 != c && null != c && c(a[b])
        }
    }
};
game.DirectorMediator = game.IMediator.extend({
    sceneMediatorStack: null,
    currSceneMediator: null,
    ctor: function(a) {
        this.currView = a;
        this.sceneMediatorStack = new game.Stack
    },
    show: function(a) {},
    showScene: function(a) {
        this.currSceneMediator && this.currSceneMediator.rootLayerMediator && this.currSceneMediator.rootLayerMediator._pDispose();
        if (this.currSceneMediator) for (var b = this.currSceneMediator.layerMediatorList; 0 < b.size();) b.pop()._pDispose();
        this.currSceneMediator = a;
        this.sceneMediatorStack = new game.Stack;
        this.sceneMediatorStack.push(a);
        cc.director.runScene(a.currScene)
    },
    pushScene: function(a) {
        this.currSceneMediator = a;
        this.sceneMediatorStack.push(a);
        cc.director.pushScene(a.currScene)
    },
    popScene: function() {
        this.sceneMediatorStack.pop();
        this.currSceneMediator = this.sceneMediatorStack.top();
        cc.director.popScene()
    }
});
game.SceneMediator = game.IMediator.extend({
    currScene: null,
    currLayerMediator: null,
    rootLayerMediator: null,
    layerMediatorList: null,
    ctor: function(a) {
        this.currScene = a;
        this.layerMediatorList = new game.Stack
    },
    show: function(a) {
        void 0 == this.currLayerMediator || null == this.currLayerMediator ? (this.rootLayerMediator.init(), this.rootLayerMediator.show(this.currScene, a)) : (this.currLayerMediator.init(), this.currLayerMediator.isRoot = !1, this.currLayerMediator.show(this.currScene, a))
    },
    rootLayer: function(a) {
        this.rootLayerMediator = a
    },
    showRoot: function() {
        this.show()
    },
    showLayer: function(a, b) {
        this.currLayerMediator = a;
        this.layerMediatorList = new game.Stack;
        this.layerMediatorList.push(a);
        this.show(b)
    },
    pushLayer: function(a, b) {
        this.currLayerMediator = a;
        this.layerMediatorList.push(a);
        this.show(b)
    },
    popLayer: function(a) {
        var b = this.layerMediatorList.pop();
        b && b._pDispose(); (this.currLayerMediator = this.layerMediatorList.top()) ? this.currLayerMediator.freshen(a) : this.rootLayerMediator.freshen(a)
    }
});
game.LayerMediator = game.IMediator.extend({
    currView: null,
    backBtn: null,
    mask: null,
    isRoot: !0,
    ctor: function(a) {
        this.currView = a
    },
    show: function(a, b) {
        if (!this.isRoot) {
            var c = cc.winSize;
            this.mask = new cc.LayerColor(cc.color(0, 0, 0, 180), c.width, c.height);
            a.addChild(this.mask);
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: !0,
                onTouchBegan: this.onTouchBegan
            },
            this.mask)
        }
    },
    onTouchBegan: function(a, b) {
        game.log("\u70b9\u51fb\u5728\u975e\u529f\u80fd\u533a\u4e86\uff0c\u53ef\u4ee5\u64ad\u653e\u4e00\u4e9b\u975e\u529f\u80fd\u7279\u6548\u3002");
        return ! 0
    },
    init: function() {
        throw Error("\u5b50\u7c7b\u5fc5\u987b\u5b9e\u73b0init\u65b9\u6cd5\uff0c\u5728\u8be5\u65b9\u6cd5\u5185\u6ce8\u518c\u76d1\u542c\u3002");
    },
    freshen: function(a) {
        game.log("freshen")
    },
    _pDispose: function() {
        this.destroy();
        this.currView.removeFromParent(!0);
        this.mask && this.mask.removeFromParent(!0)
    },
    destroy: function() {
        throw Error("\u5b50\u7c7b\u5fc5\u987b\u5b9e\u73b0destroy\u65b9\u6cd5\uff0c\u5728\u8be5\u65b9\u6cd5\u5185\u5220\u9664\u76d1\u542c\u3002");
    }
});
game.Notification = function() {
    return new _Notification
} ();
function _Notification() {
    game.log("Notification init.")
}
game.Notification.callbackList = null;
game.Notification.init = function() {
    game.Notification.callbackList = new game.Map
};
game.Notification.subscrib = function(a, b) {
    if (game.Notification.callbackList.contains(a)) {
        var c = game.Notification.callbackList.get(a);
        c.push(b)
    } else c = [],
    c.push(b),
    game.Notification.callbackList.put(a, c)
};
game.Notification.unsubscrib = function(a, b) {
    if (game.Notification.callbackList.contains(a)) for (var c = game.Notification.callbackList.get(a), d = 0; d < c.length; d++) if (c[d] == b) return c.splice(d, 1),
    !0;
    return ! 1
};
game.Notification.removebByType = function(a) {
    return game.Notification.callbackList.contains(a) ? game.Notification.callbackList.remove(a) : !1
};
game.Notification.removeAll = function() {
    game.Notification.callbackList.clear()
};
game.Notification.send = function(a, b) {
    if (game.Notification.callbackList.contains(a)) for (var c = game.Notification.callbackList.get(a), d = 0; d < c.length; d++) if (void 0 != c[d] && null != c[d]) c[d](b)
};
game.StaticDataUtil = function() {
    return new _StaticDataUtile
} ();
function _StaticDataUtile() {}
game.StaticDataUtil._dataMap = null;
game.StaticDataUtil.init = function() {
    game.StaticDataUtil._dataMap = new game.Map
};
game.StaticDataUtil.add = function(a, b) {
    for (var c = b.split("\n"), d = c[0].split(","), e = "[", h = 1; h < c.length; h++) {
        var g = c[h].split(",");
        if ("" == g[0] || void 0 == g[0] || "\r" == g[0]) break;
        for (var e = e + "{",
        f = 0; f < d.length && "" != d[f]; f++) e += '"' + d[f] + '":"' + g[f] + '", ';
        e = e.substring(0, e.length - 2);
        e += "},"
    }
    e = e.substring(0, e.length - 1);
    c = JSON.parse(e + "]");
    d = [];
    for (e = 0; e < c.length; e++) d.push(c[e]);
    game.StaticDataUtil._dataMap.put(a, d)
};
game.StaticDataUtil.getObjById = function(a, b) {
    var c = game.StaticDataUtil._dataMap.get(a);
    if (null == c) return null;
    for (var d = 0; d < c.length; d++) if (c[d].id == b) return c[d];
    return null
};
game.StaticDataUtil.getObjsByKey = function(a) {
    return game.StaticDataUtil._dataMap.get(a)
};
game.StaticDataUtil.getSkillDataByGroupIdAndLv = function(a, b) {
    for (var c = game.StaticDataUtil.getObjsByKey(game.Skill_data), d = null, e = 0; e < c.length && (d = c[e], d.group != a || d.level != b); e++);
    return d
};
game.Base64 = cc.Class.extend({
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    ctor: function() {},
    encode: function(a) {
        var b = "",
        c, d, e, h, g, f, k = 0;
        for (a = this._utf8_encode(a); k < a.length;) c = a.charCodeAt(k++),
        d = a.charCodeAt(k++),
        e = a.charCodeAt(k++),
        h = c >> 2,
        c = (c & 3) << 4 | d >> 4,
        g = (d & 15) << 2 | e >> 6,
        f = e & 63,
        isNaN(d) ? g = f = 64 : isNaN(e) && (f = 64),
        b = b + this._keyStr.charAt(h) + this._keyStr.charAt(c) + this._keyStr.charAt(g) + this._keyStr.charAt(f);
        return b
    },
    decode: function(a) {
        var b = "",
        c, d, e, h, g, f = 0;
        for (a = a.replace(/[^A-Za-z0-9\+\/\=]/g, ""); f < a.length;) c = this._keyStr.indexOf(a.charAt(f++)),
        d = this._keyStr.indexOf(a.charAt(f++)),
        h = this._keyStr.indexOf(a.charAt(f++)),
        g = this._keyStr.indexOf(a.charAt(f++)),
        c = c << 2 | d >> 4,
        d = (d & 15) << 4 | h >> 2,
        e = (h & 3) << 6 | g,
        b += String.fromCharCode(c),
        64 != h && (b += String.fromCharCode(d)),
        64 != g && (b += String.fromCharCode(e));
        return b = this._utf8_decode(b)
    },
    _utf8_encode: function(a) {
        a = a.replace(/\r\n/g, "\n");
        for (var b = "",
        c = 0; c < a.length; c++) {
            var d = a.charCodeAt(c);
            128 > d ? b += String.fromCharCode(d) : (127 < d && 2048 > d ? b += String.fromCharCode(d >> 6 | 192) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128)), b += String.fromCharCode(d & 63 | 128))
        }
        return b
    },
    _utf8_decode: function(a) {
        for (var b = "",
        c = 0,
        d = c1 = c2 = 0; c < a.length;) d = a.charCodeAt(c),
        128 > d ? (b += String.fromCharCode(d), c++) : 191 < d && 224 > d ? (c2 = a.charCodeAt(c + 1), b += String.fromCharCode((d & 31) << 6 | c2 & 63), c += 2) : (c2 = a.charCodeAt(c + 1), c3 = a.charCodeAt(c + 2), b += String.fromCharCode((d & 15) << 12 | (c2 & 63) << 6 | c3 & 63), c += 3);
        return b
    }
});
game.DataTools = {};
game.DataTools.getCurrData = function() {
    var a = new Date,
    b = a.getYear() + 1900,
    c = a.getMonth() + 1,
    a = a.getDate();
    return b + "-" + c + "-" + a
};
game.DataTools.getCurrMonth = function() {
    return (new Date).getMonth() + 1
};
game.DataTools.getDaysByMonth = function(a) {
    var b = (new Date).getYear() + 1900;
    return 1 == a || 3 == a || 5 == a || 7 == a || 8 == a || 10 == a || 12 == a ? 31 : 2 == a ? 0 == b % 4 && 0 != b % 100 || 0 == b % 400 ? 29 : 28 : 4 == a || 6 == a || 9 == a || 11 == a ? 30 : 0
};
game.DataTools.getCurrMonthDays = function() {
    return game.DataTools.getDaysByMonth(game.DataTools.getCurrMonth())
};
game.NumberTools = {};
game.NumberTools.min = function(a, b) {
    return parseInt(a) > parseInt(b) ? b: a
};
game.NumberTools.max = function(a, b) {
    return parseInt(a) > parseInt(b) ? a: b
};
game.ViewTools = {};
game.ViewTools.adapter = function(a) {
    a.anchorX = 0.5;
    a.anchorY = 0.5
};
game.ViewTools.zoom = function(a) {
    var b = cc.winSize;
    a.anchorX = 0.5;
    a.anchorY = 0.5;
    a.scaleX = game.Facade.zoom;
    a.scaleY = game.Facade.zoom;
    a.x = b.width / 2;
    a.y = b.height / 2
};
game.LanguageTools = {};
game.LanguageTools.getWords = function(a) {
    var b = game.StaticDataUtil.getObjById(game.Language, a);
    a = "\u8bf7\u586b\u8868\uff1a" + a;
    b && (a = b.value);
    a = a.replace(/#\$d/g, ",");
    a = a.replace(/#\$y/g, '"');
    return a = a.replace(/#\$h/g, "\n")
};
game.LanguageTools.getDynWords = function(a, b) {
    var c = game.StaticDataUtil.getObjById(game.Language, a),
    d = "\u8bf7\u586b\u8868\uff1a" + a;
    c && (d = c.value);
    for (c = 0; c < b.length; c++) d = d.replace("#" + (c + 1) + "#", b[c]);
    d = d.replace(/#\$d/g, ",");
    d = d.replace(/#\$y/g, '"');
    return d = d.replace(/#\$h/g, "\n")
};
game.LoaderItem = cc.Class.extend({
    type: 0,
    url: "",
    key: "",
    ctor: function(a, b, c) {
        this.type = a;
        this.url = b;
        this.key = c
    }
});
game.LoaderManager = cc.Class.extend({
    ctor: function() {},
    load: function(a, b) {
        for (var c = 0; c < a.length; c++) this.loadItem(a[c], b)
    },
    loadItem: function(a, b) {
        setTimeout(function() {
            if ("txt" == a.type) {
                var c = cc.loader.getRes(a.url);
                b(c, a.key)
            }
        },
        10)
    }
});
game.ScrollView = ccui.Layout.extend({
    _innerView: null,
    ctor: function() {
        this._super();
        this._innerView = new game.InnerView;
        this.addChild(this._innerView)
    },
    setPageSize: function(a) {
        this._innerView.setPageSize(a)
    },
    addPage: function(a) {
        this._innerView.addPage(a)
    },
    getCurPageIndex: function() {
        return this._innerView.getCurPageIndex()
    },
    scrollToPage: function(a) {
        this._innerView.scrollToPage(a)
    },
    gotoPage: function(a) {
        this._innerView.gotoPage(a)
    }
});
game.InnerView = cc.Layer.extend({
    _size: null,
    _currPageIndex: 0,
    _pageCount: 0,
    ctor: function() {
        this._super()
    },
    setPageSize: function(a) {
        this._size = a
    },
    addPage: function(a) {
        var b = new ccui.Layout;
        b.setSize(this._size);
        b.setClippingEnabled(!0);
        b.addChild(a);
        b.x = this._pageCount * this._size.width;
        this.addChild(b);
        this._pageCount++
    },
    getCurPageIndex: function() {
        return this._currPageIndex
    },
    scrollToPage: function(a) {
        var b = a - this._currPageIndex,
        c = Math.abs(b),
        b = cc.moveBy(0.5 * c, cc.p( - this._size.width * b, 0));
        this.runAction(b);
        this._currPageIndex = a
    },
    gotoPage: function(a) {
        this.x = -this._size.width * (a - this._currPageIndex);
        this._currPageIndex = a
    }
});
game.LocalStoreManager = {};
game.LocalStoreManager.serverHandlerMap = null;
game.LocalStoreManager.sKey = "game";
game.LocalStoreManager.isInit = !1;
game.LocalStoreManager.init = function(a, b) { ! 1 == game.LocalStoreManager.isInit && (game.LocalStoreManager.serverHandlerMap = new game.Map, game.LocalCache.init(a, b), game.LocalStoreManager.isInit = !0)
};
game.LocalStoreManager.registServerHandler = function(a, b) {
    game.LocalStoreManager.serverHandlerMap.put(a, b)
};
game.LocalStoreManager.requestHandler = function(a) {
    var b = game.LocalStoreManager.serverHandlerMap.get(a.pid); (new server[b]).execute(a)
};
game.LocalStoreManager.setItem = function(a, b) {
    game.LocalCache.setItem(a, b)
};
game.LocalStoreManager.setItemBatch = function(a) {
    game.LocalCache.setItemBatch(a)
};
game.LocalStoreManager.getItem = function(a) {
    return game.LocalCache.getItem(a)
};
game.LocalStoreManager.deleteItem = function(a) {
    cc.sys.localStorage.getItem(game.LocalStoreManager.sKey)[a] = null
};
game.LocalServer = cc.Class.extend({
    ctor: function() {},
    execute: function(a) {
        throw Error("\u5b50\u7c7b\u5fc5\u987b\u5b9e\u73b0execute\u65b9\u6cd5");
    },
    response: function(a) {
        SocketManager.prase("[" + JSON.stringify(a) + "]")
    },
    save: function(a, b) {
        game.LocalStoreManager.setItem(a, b)
    },
    batchSave: function(a) {
        game.LocalStoreManager.setItemBatch(a)
    },
    get: function(a) {
        return game.LocalStoreManager.getItem(a)
    },
    del: function(a) {
        game.LocalStoreManager.deleteItem(a)
    }
});
game.LocalCache = {};
game.LocalCache.cacheData = null;
game.LocalCache.sKey = "game";
game.LocalCache.init = function(a, b) {
    game.LocalCache.cacheData = {};
    game.LocalCache.sKey = a == game.LocalData.CUSTOM ? b: a == game.LocalData.UUID ? game.Frameworks.DEVICE_ID: "game";
    var c = "",
    c = cc.sys.localStorage.getItem(game.LocalCache.sKey);
    void 0 == c || "" == c || null == c ? (game.LocalCache.cacheData[game.LocalCache.sKey] = {},
    cc.sys.localStorage.setItem(game.LocalCache.sKey, JSON.stringify(game.LocalCache.cacheData))) : game.LocalCache.cacheData = JSON.parse(c)
};
game.LocalCache.getItem = function(a) {
    return game.LocalCache.cacheData[game.LocalCache.sKey][a]
};
game.LocalCache.setItem = function(a, b) {
    game.LocalCache.cacheData[game.LocalCache.sKey][a] = b;
    var c = JSON.stringify(game.LocalCache.cacheData);
    cc.sys.localStorage.setItem(game.LocalCache.sKey, c)
};
game.LocalCache.setItemBatch = function(a) {
    for (var b = 0; b < a.length; b++) game.LocalCache.cacheData[game.LocalCache.sKey][a[b].key] = a[b].value;
    a = JSON.stringify(game.LocalCache.cacheData);
    cc.sys.localStorage.setItem(game.LocalCache.sKey, a)
};
game.LocalCache.deleteItem = function(a) {
    game.LocalCache.cacheData[game.LocalCache.sKey][a] = null;
    a = JSON.stringify(game.LocalCache.cacheData);
    cc.sys.localStorage.setItem(game.LocalCache.sKey, a)
};e:null,currLayerMediator:null,rootLayerMediator:null,layerMediatorList:null,ctor:function(a){this.currScene=a;
this.layerMediatorList=new game.Stack},show:function(a){void 0==this.currLayerMediator||null==this.currLayerMediator?(this.rootLayerMediator.init(),this.rootLayerMediator.show(this.currScene,a)):(this.currLayerMediator.init(),this.currLayerMediator.isRoot=!1,this.currLayerMediator.show(this.currScene,a))},rootLayer:function(a){this.rootLayerMediator=
a},showRoot:function(){this.show()},showLayer:function(a,b){this.currLayerMediator=a;
this.layerMediatorList=new game.Stack;
this.layerMediatorList.push(a);
this.show(b)},pushLayer:function(a,b){this.currLayerMediator=a;
this.layerMediatorList.push(a);
this.show(b)},popLayer:function(a){var b=this.layerMediatorList.pop();
b&&b._pDispose();
(this.currLayerMediator=this.layerMediatorList.top())?this.currLayerMediator.freshen(a):this.rootLayerMediator.freshen(a)}});

game.LayerMediator		= game.IMediator.extend(
	{
		currView:null,
		backBtn:null,
		mask:null,
		isRoot:!0,
		ctor:function(a){this.currView=a},
		show:function(a,b){
			if(!this.isRoot){
				var c=cc.winSize;
				this.mask=new cc.LayerColor(cc.color(0,0,0,180),c.width,c.height);
				a.addChild(this.mask);
				cc.eventManager.addListener({event:cc.EventListener.TOUCH_ONE_BY_ONE,swallowTouches:!0,onTouchBegan:this.onTouchBegan},this.mask)
			}
		},
		onTouchBegan:function(a,b){
			game.log("\u70b9\u51fb\u5728\u975e\u529f\u80fd\u533a\u4e86\uff0c\u53ef\u4ee5\u64ad\u653e\u4e00\u4e9b\u975e\u529f\u80fd\u7279\u6548\u3002");
			return !0
		},
		init:function(){
			throw Error("\u5b50\u7c7b\u5fc5\u987b\u5b9e\u73b0init\u65b9\u6cd5\uff0c\u5728\u8be5\u65b9\u6cd5\u5185\u6ce8\u518c\u76d1\u542c\u3002");
		},
		freshen:function(a){game.log("freshen")},
		_pDispose:function(){
			this.destroy();
			this.currView.removeFromParent(!0);
			this.mask&&this.mask.removeFromParent(!0)
		},
		destroy:function(){
			throw Error("\u5b50\u7c7b\u5fc5\u987b\u5b9e\u73b0destroy\u65b9\u6cd5\uff0c\u5728\u8be5\u65b9\u6cd5\u5185\u5220\u9664\u76d1\u542c\u3002");
		}
	}
);

game.Notification=function(){return new _Notification}();

function _Notification(){game.log("Notification init.")}game.Notification.callbackList=null;
game.Notification.init=function(){game.Notification.callbackList=new game.Map};
game.Notification.subscrib=function(a,b){if(game.Notification.callbackList.contains(a)){var c=game.Notification.callbackList.get(a);
c.push(b)}else c=[],c.push(b),game.Notification.callbackList.put(a,c)};

game.Notification.unsubscrib=function(a,b){if(game.Notification.callbackList.contains(a))for(var c=game.Notification.callbackList.get(a),d=0;
d<c.length;
d++)if(c[d]==b)return c.splice(d,1),!0;
return!1};
game.Notification.removebByType=function(a){return game.Notification.callbackList.contains(a)?game.Notification.callbackList.remove(a):!1};
game.Notification.removeAll=function(){game.Notification.callbackList.clear()};

game.Notification.send=function(a,b){if(game.Notification.callbackList.contains(a))for(var c=game.Notification.callbackList.get(a),d=0;
d<c.length;
d++)if(void 0!=c[d]&&null!=c[d])c[d](b)};
game.StaticDataUtil=function(){return new _StaticDataUtile}();
function _StaticDataUtile(){}game.StaticDataUtil._dataMap=null;
game.StaticDataUtil.init=function(){game.StaticDataUtil._dataMap=new game.Map};

game.StaticDataUtil.add=function(a,b){for(var c=b.split("\n"),d=c[0].split(","),e="[",h=1;
h<c.length;
h++){var g=c[h].split(",");
if(""==g[0]||void 0==g[0]||"\r"==g[0])break;
for(var e=e+"{",f=0;
f<d.length&&""!=d[f];
f++)e+='"'+d[f]+'":"'+g[f]+'", ';
e=e.substring(0,e.length-2);
e+="},"}e=e.substring(0,e.length-1);
c=JSON.parse(e+"]");
d=[];
for(e=0;
e<c.length;
e++)d.push(c[e]);
game.StaticDataUtil._dataMap.put(a,d)};

game.StaticDataUtil.getObjById=function(a,b){var c=game.StaticDataUtil._dataMap.get(a);
if(null==c)return null;
for(var d=0;
d<c.length;
d++)if(c[d].id==b)return c[d];
return null};
game.StaticDataUtil.getObjsByKey=function(a){return game.StaticDataUtil._dataMap.get(a)};
game.StaticDataUtil.getSkillDataByGroupIdAndLv=function(a,b){for(var c=game.StaticDataUtil.getObjsByKey(game.Skill_data),d=null,e=0;
e<c.length&&(d=c[e],d.group!=a||d.level!=b);
e++);
return d};

game.Base64=cc.Class.extend({_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",ctor:function(){},encode:function(a){var b="",c,d,e,h,g,f,k=0;
for(a=this._utf8_encode(a);
k<a.length;
)c=a.charCodeAt(k++),d=a.charCodeAt(k++),e=a.charCodeAt(k++),h=c>>2,c=(c&3)<<4|d>>4,g=(d&15)<<2|e>>6,f=e&63,isNaN(d)?g=f=64:isNaN(e)&&(f=64),b=b+this._keyStr.charAt(h)+this._keyStr.charAt(c)+this._keyStr.charAt(g)+this._keyStr.charAt(f);
return b},decode:function(a){var b="",c,d,e,h,g,f=0;
for(a=a.replace(/[^A-Za-z0-9\+\/\=]/g,
"");
f<a.length;
)c=this._keyStr.indexOf(a.charAt(f++)),d=this._keyStr.indexOf(a.charAt(f++)),h=this._keyStr.indexOf(a.charAt(f++)),g=this._keyStr.indexOf(a.charAt(f++)),c=c<<2|d>>4,d=(d&15)<<4|h>>2,e=(h&3)<<6|g,b+=String.fromCharCode(c),64!=h&&(b+=String.fromCharCode(d)),64!=g&&(b+=String.fromCharCode(e));
return b=this._utf8_decode(b)},_utf8_encode:function(a){a=a.replace(/\r\n/g,"\n");
for(var b="",c=0;
c<a.length;
c++){var d=a.charCodeAt(c);
128>d?b+=String.fromCharCode(d):(127<d&&2048>d?b+=String.fromCharCode(d>>
6|192):(b+=String.fromCharCode(d>>12|224),b+=String.fromCharCode(d>>6&63|128)),b+=String.fromCharCode(d&63|128))}return b},_utf8_decode:function(a){for(var b="",c=0,d=c1=c2=0;
c<a.length;
)d=a.charCodeAt(c),128>d?(b+=String.fromCharCode(d),c++):191<d&&224>d?(c2=a.charCodeAt(c+1),b+=String.fromCharCode((d&31)<<6|c2&63),c+=2):(c2=a.charCodeAt(c+1),c3=a.charCodeAt(c+2),b+=String.fromCharCode((d&15)<<12|(c2&63)<<6|c3&63),c+=3);
return b}});
game.DataTools={};

game.DataTools.getCurrData=function(){var a=new Date,b=a.getYear()+1900,c=a.getMonth()+1,a=a.getDate();
return b+"-"+c+"-"+a};
game.DataTools.getCurrMonth=function(){return(new Date).getMonth()+1};
game.DataTools.getDaysByMonth=function(a){var b=(new Date).getYear()+1900;
return 1==a||3==a||5==a||7==a||8==a||10==a||12==a?31:2==a?0==b%4&&0!=b%100||0==b%400?29:28:4==a||6==a||9==a||11==a?30:0};
game.DataTools.getCurrMonthDays=function(){return game.DataTools.getDaysByMonth(game.DataTools.getCurrMonth())};

game.NumberTools={};
game.NumberTools.min=function(a,b){return parseInt(a)>parseInt(b)?b:a};
game.NumberTools.max=function(a,b){return parseInt(a)>parseInt(b)?a:b};
game.ViewTools={};
game.ViewTools.adapter=function(a){a.anchorX=0.5;
a.anchorY=0.5};
game.ViewTools.zoom=function(a){var b=cc.winSize;
a.anchorX=0.5;
a.anchorY=0.5;
a.scaleX=game.Facade.zoom;
a.scaleY=game.Facade.zoom;
a.x=b.width/2;
a.y=b.height/2};
game.LanguageTools={};

game.LanguageTools.getWords=function(a){var b=game.StaticDataUtil.getObjById(game.Language,a);
a="\u8bf7\u586b\u8868\uff1a"+a;
b&&(a=b.value);
a=a.replace(/#\$d/g,",");
a=a.replace(/#\$y/g,'"');
return a=a.replace(/#\$h/g,"\n")};

game.LanguageTools.getDynWords=function(a,b){var c=game.StaticDataUtil.getObjById(game.Language,a),d="\u8bf7\u586b\u8868\uff1a"+a;
c&&(d=c.value);
for(c=0;
c<b.length;
c++)d=d.replace("#"+(c+1)+"#",b[c]);
d=d.replace(/#\$d/g,",");
d=d.replace(/#\$y/g,'"');
return d=d.replace(/#\$h/g,"\n")};
game.LoaderItem=cc.Class.extend({type:0,url:"",key:"",ctor:function(a,b,c){this.type=a;
this.url=b;
this.key=c}});

game.LoaderManager=cc.Class.extend({ctor:function(){},load:function(a,b){for(var c=0;
c<a.length;
c++)this.loadItem(a[c],b)},loadItem:function(a,b){setTimeout(function(){if("txt"==a.type){var c=cc.loader.getRes(a.url);
b(c,a.key)}},10)}});

game.ScrollView=ccui.Layout.extend({_innerView:null,ctor:function(){this._super();
this._innerView=new game.InnerView;
this.addChild(this._innerView)},setPageSize:function(a){this._innerView.setPageSize(a)},addPage:function(a){this._innerView.addPage(a)},getCurPageIndex:function(){return this._innerView.getCurPageIndex()},scrollToPage:function(a){this._innerView.scrollToPage(a)},gotoPage:function(a){this._innerView.gotoPage(a)}});

game.InnerView=cc.Layer.extend({_size:null,_currPageIndex:0,_pageCount:0,ctor:function(){this._super()},setPageSize:function(a){this._size=a},addPage:function(a){var b=new ccui.Layout;
b.setSize(this._size);
b.setClippingEnabled(!0);
b.addChild(a);
b.x=this._pageCount*this._size.width;
this.addChild(b);
this._pageCount++},getCurPageIndex:function(){return this._currPageIndex},scrollToPage:function(a){var b=a-this._currPageIndex,c=Math.abs(b),b=cc.moveBy(0.5*c,cc.p(-this._size.width*b,0));
this.runAction(b);

this._currPageIndex=a},gotoPage:function(a){this.x=-this._size.width*(a-this._currPageIndex);
this._currPageIndex=a}});
game.LocalStoreManager={};
game.LocalStoreManager.serverHandlerMap=null;
game.LocalStoreManager.sKey="game";
game.LocalStoreManager.isInit=!1;
game.LocalStoreManager.init=function(a,b){!1==game.LocalStoreManager.isInit&&(game.LocalStoreManager.serverHandlerMap=new game.Map,game.LocalCache.init(a,b),game.LocalStoreManager.isInit=!0)};

game.LocalStoreManager.registServerHandler=function(a,b){game.LocalStoreManager.serverHandlerMap.put(a,b)};
game.LocalStoreManager.requestHandler=function(a){var b=game.LocalStoreManager.serverHandlerMap.get(a.pid);
(new server[b]).execute(a)};
game.LocalStoreManager.setItem=function(a,b){game.LocalCache.setItem(a,b)};
game.LocalStoreManager.setItemBatch=function(a){game.LocalCache.setItemBatch(a)};
game.LocalStoreManager.getItem=function(a){return game.LocalCache.getItem(a)};

game.LocalStoreManager.deleteItem=function(a){cc.sys.localStorage.getItem(game.LocalStoreManager.sKey)[a]=null};

game.LocalServer=cc.Class.extend({ctor:function(){},execute:function(a){throw Error("\u5b50\u7c7b\u5fc5\u987b\u5b9e\u73b0execute\u65b9\u6cd5");
},response:function(a){SocketManager.prase("["+JSON.stringify(a)+"]")},save:function(a,b){game.LocalStoreManager.setItem(a,b)},batchSave:function(a){game.LocalStoreManager.setItemBatch(a)},get:function(a){return game.LocalStoreManager.getItem(a)},del:function(a){game.LocalStoreManager.deleteItem(a)}});
game.LocalCache={};
game.LocalCache.cacheData=null;

game.LocalCache.sKey="game";
game.LocalCache.init=function(a,b){game.LocalCache.cacheData={};
game.LocalCache.sKey=a==game.LocalData.CUSTOM?b:a==game.LocalData.UUID?game.Frameworks.DEVICE_ID:"game";
var c="",c=cc.sys.localStorage.getItem(game.LocalCache.sKey);
void 0==c||""==c||null==c?(game.LocalCache.cacheData[game.LocalCache.sKey]={},cc.sys.localStorage.setItem(game.LocalCache.sKey,JSON.stringify(game.LocalCache.cacheData))):game.LocalCache.cacheData=JSON.parse(c)};
game.LocalCache.getItem=function(a){return game.LocalCache.cacheData[game.LocalCache.sKey][a]};

game.LocalCache.setItem=function(a,b){game.LocalCache.cacheData[game.LocalCache.sKey][a]=b;
var c=JSON.stringify(game.LocalCache.cacheData);
cc.sys.localStorage.setItem(game.LocalCache.sKey,c)};
game.LocalCache.setItemBatch=function(a){for(var b=0;
b<a.length;
b++)game.LocalCache.cacheData[game.LocalCache.sKey][a[b].key]=a[b].value;
a=JSON.stringify(game.LocalCache.cacheData);
cc.sys.localStorage.setItem(game.LocalCache.sKey,a)};

game.LocalCache.deleteItem=function(a){game.LocalCache.cacheData[game.LocalCache.sKey][a]=null;
a=JSON.stringify(game.LocalCache.cacheData);
cc.sys.localStorage.setItem(game.LocalCache.sKey,a)};

