/*global countlyVue countlyCommon CV countlyGlobal CountlyHelpers*/

(function(countlyDataManager) {

    var EXTENDED_MODELS = countlyDataManager.extended && countlyDataManager.extended.models || {};
    var EXTENDED_SERVICE = EXTENDED_MODELS.service || {};
    var EXTENDED_MODEL = EXTENDED_MODELS.model || {};
    var isDrill = countlyGlobal.plugins.indexOf("drill") > -1;

    countlyDataManager.service = Object.assign({}, {
        loadEvents: function() {
            return CV.$.ajax({
                type: "GET",
                url: countlyCommon.API_PARTS.data.r + '/data-manager/events',
                data: {
                    "app_id": countlyCommon.ACTIVE_APP_ID,
                    "preventRequestAbort": true,
                },
                dataType: "json"
            }, {"disableAutoCatch": true});
        },
        loadEventGroups: function() {
            return CV.$.ajax({
                type: "GET",
                url: countlyCommon.API_PARTS.data.r,
                data: {
                    "app_id": countlyCommon.ACTIVE_APP_ID,
                    "method": "get_event_groups",
                    "preventRequestAbort": true
                },
                dataType: "json",
            }, {"disableAutoCatch": true});
        },
        createEventGroups: function(payload) {
            return CV.$.ajax({
                type: "POST",
                url: countlyCommon.API_PARTS.data.w + "/event_groups/create",
                data: {
                    "app_id": countlyCommon.ACTIVE_APP_ID,
                    "args": JSON.stringify(payload)
                },
                dataType: "json",
            }, {"disableAutoCatch": true});
        },
        editEventGroups: function(data, order, update_status, status) {
            return CV.$.ajax({
                type: "POST",
                url: countlyCommon.API_PARTS.data.w + "/event_groups/update",
                data: {
                    "app_id": countlyCommon.ACTIVE_APP_ID,
                    "args": JSON.stringify(data),
                    "event_order": order,
                    "update_status": JSON.stringify(update_status),
                    "status": status
                },
                dataType: "json",
            }, {"disableAutoCatch": true});
        },
        deleteEventGroups: function(events) {
            return CV.$.ajax({
                type: "POST",
                url: countlyCommon.API_PARTS.data.w + "/event_groups/delete",
                data: {
                    "app_id": countlyCommon.ACTIVE_APP_ID,
                    "args": JSON.stringify(events),
                },
                dataType: "json",
            }, {"disableAutoCatch": true});
        },
        saveEvent: function(event) {
            return CV.$.ajax({
                type: "POST",
                url: countlyCommon.API_PARTS.data.w + '/data-manager/event',
                data: {
                    "app_id": countlyCommon.ACTIVE_APP_ID,
                    event: JSON.stringify(event)
                },
                dataType: "json"
            }, {"disableAutoCatch": true});
        },
        editEvent: function(eventMap, omittedSegments) {
            return CV.$.ajax({
                type: "POST",
                url: countlyCommon.API_PARTS.data.w + "/events/edit_map",
                data: {
                    "app_id": countlyCommon.ACTIVE_APP_ID,
                    "event_map": JSON.stringify(eventMap),
                    "omitted_segments": JSON.stringify(omittedSegments)
                }
            }, {"disableAutoCatch": true});
        },
        changeVisibility: function(events, visibility) {
            return CV.$.ajax({
                type: "POST",
                url: countlyCommon.API_PARTS.data.w + "/events/change_visibility",
                data: {
                    "app_id": countlyCommon.ACTIVE_APP_ID,
                    "set_visibility": visibility,
                    "events": JSON.stringify(events)
                }
            }, {"disableAutoCatch": true});
        },
        deleteEvents: function(events) {
            return CV.$.ajax({
                type: "POST",
                url: countlyCommon.API_PARTS.data.w + "/events/delete_events",
                data: {
                    "app_id": countlyCommon.ACTIVE_APP_ID,
                    "events": countlyCommon.decodeHtml(JSON.stringify(events))
                }
            }, {"disableAutoCatch": true});
        },
        getCategories: function() {
            return CV.$.ajax({
                type: "GET",
                url: countlyCommon.API_PARTS.data.r + '/data-manager/category',
                data: {
                    "app_id": countlyCommon.ACTIVE_APP_ID,
                    "preventRequestAbort": true
                },
                dataType: "json"
            }, {"disableAutoCatch": true});
        },
        createCategory: function(categories) {
            return CV.$.ajax({
                type: "POST",
                url: countlyCommon.API_PARTS.data.w + '/data-manager/category/create',
                data: {
                    "app_id": countlyCommon.ACTIVE_APP_ID,
                    categories: JSON.stringify(categories)
                },
                dataType: "json"
            }, {"disableAutoCatch": true});
        },
        editCategories: function(categories) {
            return CV.$.ajax({
                type: "POST",
                url: countlyCommon.API_PARTS.data.w + '/data-manager/category/edit',
                data: {
                    "app_id": countlyCommon.ACTIVE_APP_ID,
                    categories: JSON.stringify(categories)
                },
                dataType: "json"
            }, {"disableAutoCatch": true});
        },
        deleteCategories: function(categoryIds) {
            return CV.$.ajax({
                type: "POST",
                url: countlyCommon.API_PARTS.data.w + '/data-manager/category/delete',
                data: {
                    categoryIds: JSON.stringify(categoryIds),
                    "app_id": countlyCommon.ACTIVE_APP_ID
                },
                dataType: "json"
            }, {"disableAutoCatch": true});
        },
        changeCategory: function(events, category) {
            return CV.$.ajax({
                type: "POST",
                url: countlyCommon.API_PARTS.data.w + "/data-manager/event/change-category",
                data: {
                    "app_id": countlyCommon.ACTIVE_APP_ID,
                    "category": category,
                    "events": JSON.stringify(events)
                }
            }, {"disableAutoCatch": true});
        },
    }, EXTENDED_SERVICE);

    countlyDataManager.getVuexModule = function() {
        var EXTENDED_STATE = {};
        if (EXTENDED_MODEL.state) {
            EXTENDED_STATE = EXTENDED_MODEL.state();
        }
        var EXTENDED_GETTERS = EXTENDED_MODEL.getters;
        var EXTENDED_MUTATIONS = EXTENDED_MODEL.mutations;
        var EXTENDED_ACTIONS = EXTENDED_MODEL.actions;

        var getEmptyState = function() {
            return Object.assign({}, {
                isLoading: true,
                events: [],
                eventsMap: {},
                eventGroups: [],
                categories: [],
                categoriesMap: [],
            }, EXTENDED_STATE);
        };

        var getters = {
            events: function(state) {
                return state.events;
            },
            eventsMap: function(state) {
                return state.eventsMap;
            },
            eventGroups: function(state) {
                return state.eventGroups;
            },
            categories: function(state) {
                return state.categories;
            },
            categoriesMap: function(state) {
                return state.categoriesMap;
            },
            isLoading: function(state) {
                return state.isLoading;
            }
        };

        var mutations = {
            setEvents: function(state, val) {
                state.events = val;
            },
            setEventsMap: function(state, val) {
                state.eventsMap = val;
            },
            setEventGroups: function(state, val) {
                state.eventGroups = val;
            },
            setCategories: function(state, val) {
                state.categories = val;
            },
            setCategoriesMap: function(state, val) {
                state.categoriesMap = val;
            },
            setIsLoading: function(state, val) {
                state.isLoading = val;
            }
        };

        var actions = {
            loadEventsData: function(context) {
                var evenLoaderService = countlyDataManager.service.loadEvents;
                if (isDrill && countlyDataManager.service.loadEventsExtended) {
                    evenLoaderService = countlyDataManager.service.loadEventsExtended;
                }
                evenLoaderService().then(function(data) {
                    if (data === 'Error') {
                        data = [];
                    }
                    context.commit('setEvents', data);
                    var eventsMap = {};
                    data.forEach(function(event) {
                        eventsMap[event.key] = event;
                    });
                    context.commit('setEventsMap', eventsMap);
                    setTimeout(function() {
                        context.commit('setIsLoading', false);
                    }, 0);
                });
            },
            loadEventGroups: function(context) {
                countlyDataManager.service.loadEventGroups().then(function(data) {
                    context.commit('setEventGroups', data);
                    return data;
                });
            },
            deleteEventGroups: function(context, events) {
                countlyDataManager.service.deleteEventGroups(events).then(function(data) {
                    context.dispatch("loadEventGroups");
                    CountlyHelpers.notify({message: 'Event Group Deleted', sticky: false, type: 'success'});
                    return data;
                }).catch(function() {
                    CountlyHelpers.notify({message: 'Error while deleting event group', sticky: false, type: 'error'});
                });
            },
            changeEventGroupsVisibility: function(context, data) {
                countlyDataManager.service.editEventGroups(undefined, undefined, data.events, data.isVisible).then(function(res) {
                    context.dispatch("loadEventGroups");
                    return res;
                });
            },
            saveEventGroups: function(context, data) {
                countlyDataManager.service.createEventGroups(data).then(function(res) {
                    CountlyHelpers.notify({message: 'Event Group Created', sticky: false, type: 'success'});
                    context.dispatch("loadEventGroups");
                    return res;
                }).catch(function() {
                    CountlyHelpers.notify({message: 'Error while creating event group', sticky: false, type: 'error'});
                });
            },
            editEventGroups: function(context, data) {
                countlyDataManager.service.editEventGroups(data).then(function(res) {
                    CountlyHelpers.notify({message: 'Event Group Updated', sticky: false, type: 'success'});
                    context.dispatch("loadEventGroups");
                    return res;
                }).catch(function() {
                    CountlyHelpers.notify({message: 'Error while updating event group', sticky: false, type: 'error'});
                });
            },
            saveEvent: function(context, event) {
                countlyDataManager.service.saveEvent(event).then(function(err) {
                    if (err !== 'Error') {
                        CountlyHelpers.notify({message: 'Event Created', sticky: false, type: 'success'});
                        context.dispatch('loadEventsData');
                        context.dispatch('loadSegmentsMap');
                    }
                    else {
                        CountlyHelpers.notify({message: 'Error while creating event', sticky: false, type: 'error'});
                        return err;
                    }
                });
            },
            editEvent: function(context, event) {
                var eventMap = {};
                var omittedSegments = {};
                eventMap[event.key] = {
                    key: event.key,
                    name: event.name,
                    description: event.description,
                    is_visible: event.is_visible,
                    count: event.count,
                    sum: event.sum,
                    dur: event.dur,
                    category: event.category,
                    omit_list: event.omit_list || []
                };
                eventMap = JSON.parse(JSON.stringify(eventMap));
                if (Array.isArray(event.omit_list)) {
                    event.omit_list.forEach(function(omittedSegment) {
                        if (Array.isArray(omittedSegments[event.key])) {
                            omittedSegments[event.key].push(omittedSegment);
                        }
                        else {
                            omittedSegments[event.key] = [omittedSegment];
                        }
                    });
                }
                var segments = event.segments || [];
                var eventMeta = {
                    key: event.key,
                    segments: segments.map(function(segment) {
                        delete segment.audit;
                        return segment;
                    }),
                    status: event.status,
                    category: event.category
                };
                countlyDataManager.service.editEvent(eventMap, omittedSegments).then(function(err) {
                    if (isDrill) {
                        countlyDataManager.service.editEventMeta(eventMeta).then(function(errMeta) {
                            if (err === 'Error' || errMeta === "Error") {
                                CountlyHelpers.notify({message: 'Error while updating event', sticky: false, type: 'error'});
                                return 'Error';
                            }
                            CountlyHelpers.notify({message: 'Event Updated Successfully', sticky: false, type: 'success'});
                            context.dispatch('loadEventsData');
                            context.dispatch('loadValidations');
                            context.dispatch('loadSegmentsMap');
                        });
                    }
                    else {
                        if (err === 'Error') {
                            CountlyHelpers.notify({message: 'Error while updating event', sticky: false, type: 'error'});
                            return 'Error';
                        }
                        CountlyHelpers.notify({message: 'Event Updated Successfully', sticky: false, type: 'success'});
                        context.dispatch('loadEventsData');
                    }
                });
            },
            omitSegments: function(context, data) {
                countlyDataManager.service.editEvent(data.eventMap, data.omittedSegments).then(function(res) {
                    if (res === 'Error') {
                        return res;
                    }
                    context.dispatch('loadEventsData');
                    context.dispatch('loadSegmentsMap');
                });
            },
            changeVisibility: function(context, data) {
                var visibility = data.isVisible ? 'show' : 'hide';
                countlyDataManager.service.changeVisibility(data.events, visibility).then(function(res) {
                    if (res === 'Error') {
                        return res;
                    }
                    context.dispatch('loadEventsData');
                    context.dispatch('loadSegmentsMap');
                });
            },
            deleteEvents: function(context, events) {
                countlyDataManager.service.deleteEvents(events).then(function(res) {
                    countlyDataManager.service.deleteEventsMeta(events).then(function(res2) {
                        if (res === 'Error' || res2 === 'Error') {
                            CountlyHelpers.notify({message: 'Error while deleting Event', sticky: false, type: 'error'});
                            return 'Error';
                        }
                        context.dispatch('loadEventsData');
                        context.dispatch('loadSegmentsMap');
                        CountlyHelpers.notify({message: 'Event Deleted', sticky: false, type: 'success'});
                    });
                }).catch(function() {
                    CountlyHelpers.notify({message: 'Error while deleting Event', sticky: false, type: 'error'});
                });
            },
            loadCategories: function(context) {
                countlyDataManager.service.getCategories().then(function(data) {
                    var map = {};
                    data.forEach(function(c) {
                        map[c._id] = c.name;
                    });
                    context.commit('setCategories', data);
                    context.commit('setCategoriesMap', map);
                    return data;
                });
            },
            saveCategories: function(context, categories) {
                countlyDataManager.service.createCategory(categories).then(function(data) {
                    CountlyHelpers.notify({message: 'Category Created', sticky: false, type: 'success'});
                    context.dispatch('loadEventsData');
                    context.dispatch('loadSegmentsMap');
                    return data;
                }).catch(function() {
                    CountlyHelpers.notify({message: 'Error while creating Category', sticky: false, type: 'error'});
                });
            },
            editCategories: function(context, categories) {
                return countlyDataManager.service.editCategories(categories).then(function(data) {
                    CountlyHelpers.notify({message: 'Category Updated', sticky: false, type: 'success'});
                    context.dispatch('loadEventsData');
                    context.dispatch('loadSegmentsMap');
                    return data;
                }).catch(function() {
                    CountlyHelpers.notify({message: 'Error while creating Category', sticky: false, type: 'error'});
                });
            },
            deleteCategories: function(context, categories) {
                countlyDataManager.service.deleteCategories(categories).then(function(data) {
                    CountlyHelpers.notify({message: 'Category Deleted', sticky: false, type: 'success'});
                    return data;
                }).catch(function() {
                    CountlyHelpers.notify({message: 'Error while deleting category', sticky: false, type: 'error'});
                });
            },
            changeCategory: function(context, data) {
                countlyDataManager.service.changeCategory(data.events, data.category).then(function(res) {
                    context.dispatch('loadEventsData');
                    context.dispatch('loadSegmentsMap');
                    CountlyHelpers.notify({message: 'Category Changed', sticky: false, type: 'success'});
                    return res;
                }).catch(function() {
                    CountlyHelpers.notify({message: 'Error while changing category', sticky: false, type: 'error'});
                });
            },
        };

        return countlyVue.vuex.Module("countlyDataManager", {
            state: getEmptyState,
            getters: Object.assign({}, getters, EXTENDED_GETTERS),
            actions: Object.assign({}, actions, EXTENDED_ACTIONS),
            mutations: Object.assign({}, mutations, EXTENDED_MUTATIONS),
            submodules: []
        });
    };
}(window.countlyDataManager = window.countlyDataManager || {}));