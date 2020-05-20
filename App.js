Ext.define('CustomApp', {
    extend: 'Rally.app.TimeboxScopedApp',
    scopeType: 'release',
    comboboxConfig: {
        fieldLabel: 'Select an timebox:</div>',
        width: 400
    },
    componentCls: 'app',
    // launch: function() {
    //     debugger;
    //     var filters = [], timeboxScope = this.getContext().getTimeboxScope();
    //     if(timeboxScope) {
    //         filters.push(timeboxScope.getQueryFilter());
    //         console.log(filters);
    //     }
    //     else {
    //         console.log("no timeboxscope");           
    //     }
    //     // this.board = this.add({
    //     //     xtype: 'rallycardboard',
    //     //     storeConfig: {
    //     //         filters: filters
    //     //     }
    //     // });
    // },

    onTimeboxScopeChange: function(newTimeboxScope) {
        this.callParent(arguments);
        console.log(newTimeboxScope.getQueryFilter());
        Ext.create('Rally.data.wsapi.Store', {
            model: 'PortfolioItem/Feature',
            autoLoad: true,
            listeners: {
                load: this._onDataLoaded,
                scope: this
            },
            fetch: ['Rank', 'FormattedID', 'Name', 'Parent', 'c_ProjectID', 'c_ServiceNowID', 'LeafStoryPlanEstimateTotal', 'Parent.Parent'],
            filters: newTimeboxScope.getQueryFilter()
        });
    },
    _onDataLoaded: function (store, records) {
        //to-do: before creating grid, for each feature get the parent its parent Epic (the initiative)
        //not sure how to accomplish that
        this.remove('g1');
        this.add({
            xtype: 'rallygrid',
            itemId: 'g1',
            editable: false,
            store: Ext.create('Rally.data.custom.Store', {
                data: records
            }),
            forceFit: true,
            columnCfgs: [{
                text: 'Rank',
                dataIndex: 'Rank'
            },{
                xtype: 'templatecolumn',
                text: 'ID',
                dataIndex: 'FormattedID',
                width: 100,
                tpl: Ext.create('Rally.ui.renderer.template.FormattedIDTemplate')
            }, {
                text: 'Name',
                dataIndex: 'Name',
                flex: 1
            }, {
                xtype: 'templatecolumn',
                text: 'Epic',
                dataIndex: 'Parent',
                width: 100,
                flex: 1,
                tpl: Ext.create('Rally.ui.renderer.template.ParentTemplate')
            // }, {
            //     xtype: 'templatecolumn',
            //     text: 'Initiative',
            //     dataIndex: ?
            //     width: 100,
            //     flex: 1,
            //     tpl: Ext.create('Rally.ui.renderer.template.ParentTemplate')
            }, {
                text: 'ProjectID',
                dataIndex: 'c_ProjectID',
                width: 60,
            }, {
                text: 'ServiceNowID',
                dataIndex: 'c_ServiceNowID',
                flex: 1
            }, {
                text: 'Story Points',
                dataIndex: 'LeafStoryPlanEstimateTotal',
                flex: 1
            }]
        });
    }    
});
