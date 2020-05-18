    Ext.BLANK_IMAGE_URL = 'extjs/resources/images/default/tree/s.gif'  
    Ext.onReady(function() {  
        //数据列  
                var columns = [ {  
                    header : '项目名称',  
                    dataIndex : 'task',  
                    width : 150  
                }, {  
                    header : '项目周期',  
                    width : 100,  
                    dataIndex : 'duration',  
                    align : 'center',  
                    sortType : 'asFloat'  
                }, {  
                    header : '开发小组',  
                    width : 140,  
                    dataIndex : 'user'  
                } ];  
                  
                // 初始化一个根节点的子节点  
                var data = [ {  
                    task : '',  
                    duration : '',  
                    user : '',  
                    // expanded : false,  
                    iconCls : 'task-folder',  
                    children : []  
                } ]  
                //创建根节点  
                var root = new Ext.tree.TreeNode({  
                    task : '',  
                    duration : '',  
                    user : '',  
                    expanded : true  
                });  
      
                var treeGrid = new Ext.ux.tree.TreeGrid({  
                    title : '树形表格',  
                    width : 600,  
                    height : 500,  
                    autoHeight : false,  
                    collapsible : true,  
                    columns : columns,  
                    rootVisible : false,  
                    expanded : true  
                });  
                treeGrid.setRootNode(root);  
                //root被隐藏  
                // 给root添加一个空节点。新的节点添加就在这个节点下。  
                treeGrid.root.appendChild(data);  
                  
                var rightClickNode;  
                var rightClick = new Ext.menu.Menu({  
                    items : [  
                            {  
                                id : 'add-node',  
                                text : '添加',  
                                handler : function() {  
                                    var node1 = new Ext.tree.TreeNode({  
                                        task : "新添加的节点",  
                                        duration : "新添加的节点",  
                                        user : "新添加的节点",  
                                        expanded : true  
                                    });  
                                    rightClickNode.appendChild(node1);  
                                }  
                            },  
                            {  
                                id : 'delete-node',  
                                text : '删除',  
                                handler : function() {  
                                    Ext.MessageBox.confirm("操作提示", "你确定要删除这行记录吗？",  
                                            function(button, text) {  
                                                if (button == 'yes') {  
                                                    rightClickNode.remove();  
                                                }  
                                            });  
                                }  
                            } ]  
                });  
      
                var rightClickFn = function(node, e) {  
                    e.preventDefault();  
                    node.select();  
                    rightClick.showAt(e.getXY());  
                    rightClickNode = node;  
                };  
                var click = function(node, e) {  
                    // 新加节点模型  
                    var data = [ {  
                        nodeparm1 : "添加的子节点",  
                        nodeparm2 : "nan",  
                        nodeparm3 : 10  
                    } ];  
                    if (!node.init) {  
                        for ( var i = 0; i < data.length; i++) {  
                            node.expand(true);  
                            var node1 = new Ext.tree.TreeNode({  
                                task : data[i].nodeparm1,  
                                duration : data[i].nodeparm2,  
                                user : data[i].nodeparm3,  
                                expanded : true  
                            });  
                            if (true) {// 如果有下级目录  
                                node1.setIcon("extjs/resources/images/default/tree/folder.gif");  
                            }  
                            node.appendChild(node1);  
                            node.expand(true);  
                            node.init = true;  
                        }  
                    }  
                };  
                treeGrid.addListener('contextmenu', rightClickFn, this);  
                treeGrid.addListener('click', click, this);  
                var mainView = new Ext.Viewport({  
                    layout : 'border',  
                    renderTo : Ext.getBody(),  
                    items : [ {  
                        region : 'center',  
                        layout : 'fit',  
                        plain : true,  
                        items : [ treeGrid ]  
                    } ]  
                });  
                setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
            });  