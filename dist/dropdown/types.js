export var Relation;
(function (Relation) {
    Relation[Relation["INDEPENDENT"] = 1] = "INDEPENDENT";
    Relation[Relation["CONTROLLER"] = 2] = "CONTROLLER";
    Relation[Relation["INVERSE"] = 3] = "INVERSE";
    Relation[Relation["EXCLUSIVE"] = 4] = "EXCLUSIVE";
})(Relation || (Relation = {}));
export var GUARDTYPE;
(function (GUARDTYPE) {
    GUARDTYPE[GUARDTYPE["ALLOW"] = 1] = "ALLOW";
    GUARDTYPE[GUARDTYPE["PREVENT"] = 2] = "PREVENT";
    GUARDTYPE[GUARDTYPE["PARENT"] = 3] = "PARENT";
    GUARDTYPE[GUARDTYPE["COLLECTIVE"] = 4] = "COLLECTIVE";
})(GUARDTYPE || (GUARDTYPE = {}));
//# sourceMappingURL=types.js.map