/*global Ext, Rally */
Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
        console.log('dAAA');

        this.add({
            xtype: 'rallygrid',
            columnCfgs: [
                'FormattedID',
                'Name',
                'Owner'
            ],
            context: this.getContext(),
            enableEditing: false,
            showRowActionsColumn: false,
            storeConfig: {
                model: 'userstory'
            }
        });

        console.log('aAAA');
        this.releaseStories = new Ext.grid.Panel({
            title: 'Simpsons',
            renderTo: Ext.getBody()
        });
        console.log('bAAA');

        this.add(this.releaseStories);
        console.log('cAAA');

        console.log('bbbb');

        this.getCurrentRelease();
    },

    getCurrentRelease: function() {
        var today = Rally.util.DateTime.toIsoString(new Date());

        var releaseDateFilter = Ext.create('Rally.data.wsapi.Filter', {
            property: 'ReleaseDate',
            operator: '>',
            value: today
        });

        var releaseFilter = releaseDateFilter.and(Ext.create(
                'Rally.data.wsapi.Filter', {
                    property: 'ReleaseStartDate',
                    operator: '<=',
                    value: today
                }));

        Ext.create('Rally.data.wsapi.Store', {
            model: 'Release',
//             fetch: [ 'FormattedID', 'Name', 'ReleaseDate',
//                     'ReleaseStartDate' ],
            limit: Infinity,
            filters: releaseFilter,
            autoLoad: true,
            listeners: {
                load: function(store, records) {
                    records.forEach(function(record) {
                        Ext.create('Rally.data.wsapi.Store', {
                            model: 'User Story',
                            limit: Infinity,
                            filters: [ {
                                property: 'Release',
                                operator: '=',
                                value: record.data._ref
                            } ],
                            autoLoad: true,
                            listeners: {
                                load: function(storyStore, storyRecords) {
                                    storyRecords.forEach(function(storyRecord) {
                                        console.log(storyRecord.data);
                                    });
                                }
                            }
                        });
                    });
                },
                scope: this
            }
        });
    }
});
