const CONST_APP_NAME = "Mind Maps";
var isReadOnly = true, isNewMap = false;
var mapCreaterId = "";
var loadDone = false;
var getURL = ""
var loginUserId = '';

var isMobile = false; //initiate as false
// device detection
if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
    isMobile = true;
}

function createDiv(classToAdd) {
    let childBlock = document.createElement('div');
    childBlock.setAttribute('class', classToAdd);
    return childBlock;
}

function showChildMaps(maps) {
    var parentDiv = document.getElementById('showChildMaps');
    var childMaps = document.getElementById('loadChildsId');
    if (parentDiv) {
        for (i = 0; i < childMaps.children.length; i++) {//remove existing tabs
            if (childMaps.children[i].textContent != "+") {
                childMaps.children[i].remove();
                i--;
            }
        }
        for (i = 0; i < maps.length; i++) {
            setChildTab(maps[i], childMaps);
        }
    }
}

function hideChildMaps() {
    $("#showChildMaps").css({ "display": "none" });
}
function makeChildMapsVisible() {
    $("#showChildMaps").css({ "display": "block" });
}

function setChildTab(map, parentDiv) {
    if (!parentDiv) {
        parentDiv = document.getElementById('loadChildsId');
    }
    let childBlock = document.createElement('button');
    childBlock.setAttribute('data-command', 'LoadChildMap');
    childBlock.setAttribute('url', '/' + map.Url);

    if (map.Url.split("-pid")[0].indexOf(MM.App.map.getId()) > -1) {
        childBlock.setAttribute('class', 'tablinks current btn btn-primary btn-xs');
        //childBlock.setAttribute('disabled', 'disabled');

    } else {
        childBlock.setAttribute('class', 'tablinks btn btn-default btn-xs');
    }

    childBlock.innerHTML = map.DisplayName;
    parentDiv.appendChild(childBlock);
    //parentDiv.parentNode.insertBefore(childBlock, parentDiv.nextSibling);
}

function DeleteMap() {
    var name = MM.App.map.getName();
    var id = MM.App.map.getId();
    var parentMapId;
    if (name) {
        if (location.search.indexOf("url") > 0) {//map is already saved
            parentMapId = decodeURIComponent(location.search).split('-pid=')[1];
        }
        if (!parentMapId && $('#loadChildsId ').length > 1) {
            toastr.warning("You're about to delete parent map, it will delete all child maps");
            setTimeout(function () {
                sendDeleteRequest(name, id, parentMapId);
            }, 2500)
        } else {
            sendDeleteRequest(name, id, parentMapId);
        }
    }
}
function sendDeleteRequest(name,id, isChildMap) {
    if (confirm("Are you sure you want to delete '" + name + "'?")) {
        $.ajax({
            type: "POST",
            url: "/Home/DeleteMap",
            data: JSON.stringify({ name: name, id: id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                isChangesSaved = true;
                if (isChildMap) {
                    location.href = "/map/?url=" + $("#loadChildsId").children().eq(0).attr("url");
                } else {
                    location.href = "/";
                }
            },
            error: function (result) {
                console.log(result);
            }
        });
    }
}

