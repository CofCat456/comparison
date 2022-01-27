//綁定元件
const buttonGroup = document.querySelector('.button-group');
const fruitsBtn = document.querySelector('.fruitsBtn');
const flowersBtn = document.querySelector('.flowersBtn');
const vegetablesBtn = document.querySelector('.vegetablesBtn');
const showList = document.querySelector('.showList');
const page = document.querySelector('.page');
const pagBtn = document.querySelector('.pagBtn');
const Upperprice = document.querySelector('.Upperprice');
const Middleprice = document.querySelector('.Middleprice');
const Lowerprice = document.querySelector('.Lowerprice');
const Averageprice = document.querySelector('.Averageprice');
const Tradingvolume = document.querySelector('.Tradingvolume');
const jsSelect = document.getElementById('js-select');
const jsMoblieSelect = document.getElementById('js-moblie-select');
const roundedEnd = document.querySelector('.rounded-end');
const searchBtn = document.querySelector('.search');
const showResult = document.querySelector('.show-result');

//copy分類資料存放位置
let flower = [];
let vegetable = [];
let fruit = [];

let currentPage = 1; //當前頁數
let index = 0; //總頁數
let data = []; //進行顯示的資料
let count = 3; //分頁計數器
let currentPageId; //顯示的資料 抓取id

//true === 從高排到低 false === 從低排到高
let sorData = {
    Upperprice: true,
    Middleprice: true,
    Lowerprice: true,
    Averageprice: true,
    Tradingvolume: true,
};

//抓取資料
axios
    .get('https://hexschool.github.io/js-filter-data/data.json')
    .then(function (response) {
        //資料抓取成功
        console.log('資料抓取成功', response);
        //分類資料
        for (let key in response.data) {
            if (response.data[key]['種類代碼'] === 'N05') {
                fruit.push(response.data[key]);
            } else if (response.data[key]['種類代碼'] === 'N04') {
                vegetable.push(response.data[key]);
            } else if (response.data[key]['種類代碼'] === 'N06') {
                flower.push(response.data[key]);
            }
        }

        //確認資料是否成功分類
        console.log('花卉', flower);
        console.log('蔬菜', vegetable);
        console.log('水果', fruit);
    })
    .catch(function (error) {
        console.log('資料抓取失敗', error);
    })
    .then(function () {
        // always executed
    });

//點選水果按鈕時
fruitsBtn.addEventListener('click', function (e) {
    //確認點擊成功
    buttonGroup.children[0].classList.remove('btn-typeClicked');
    buttonGroup.children[2].classList.remove('btn-typeClicked');
    fruitsBtn.classList.add('btn-typeClicked');
    //reset Select
    jsSelect.selectedIndex = 0;
    console.log('點選水果');

    //將要顯示的資料賦給data 淺層複製
    for (let key in fruit) {
        data[key] = fruit[key];
    }
    console.log(data);

    //reset
    currentPage = 1;
    removeArrow();

    //計算資料所需頁數
    count = 3;
    pagination();

    //資料渲染
    dataRender();
});

//點選花卉的時候
flowersBtn.addEventListener('click', function (e) {
    //確認點擊成功
    buttonGroup.children[0].classList.remove('btn-typeClicked');
    buttonGroup.children[1].classList.remove('btn-typeClicked');
    flowersBtn.classList.add('btn-typeClicked');
    //reset Select
    jsSelect.selectedIndex = 0;
    console.log('點選花卉');

    //將要顯示的資料賦給data 淺層複製
    for (let key in flower) {
        data[key] = flower[key];
    }
    console.log(data);

    //reset
    currentPage = 1;
    removeArrow();

    //計算資料所需頁數
    count = 3;
    pagination();

    //資料渲染
    dataRender();
});

vegetablesBtn.addEventListener('click', function (e) {
    //確認點擊成功
    buttonGroup.children[1].classList.remove('btn-typeClicked');
    buttonGroup.children[2].classList.remove('btn-typeClicked');
    vegetablesBtn.classList.add('btn-typeClicked');
    //reset Select
    jsSelect.selectedIndex = 0;
    console.log('點選蔬菜');

    //將要顯示的資料賦給data 淺層複製
    for (let key in vegetable) {
        data[key] = vegetable[key];
    }
    console.log(data);

    //reset
    currentPage = 1;
    removeArrow();

    //計算資料所需頁數
    count = 3;
    pagination();

    //資料渲染
    dataRender();
});

//點選分頁時
page.addEventListener('click', function (e) {
    const pageBtn = e.target;

    //currentPage === 目前頁數
    //count === 頁數計數器
    //如果點選上一頁
    if (pageBtn.getAttribute('data-btn') === 'prev') {
        //頁數計數器-1
        count -= 1;
        currentPage -= 1;
        //如果點選下一頁
    } else if (pageBtn.getAttribute('data-btn') === 'next') {
        //頁數計數器-+1
        count += 1;
        currentPage += 1;
        //如果點選中間任意數字
    } else if (pageBtn.getAttribute('data-num')) {
        //頁數計數器-直接等於點到的頁數 例如點到4 就到第4頁
        console.log(pageBtn.getAttribute('data-num'));
        count = parseInt(pageBtn.getAttribute('data-num'));
        currentPage = count;
    }

    //當前頁面不小心超過總頁數時 等於總頁數
    if (currentPage >= index) {
        currentPage = index;

        //當前頁面不小心小於1時 等於第一頁
    } else if (currentPage < 1) {
        currentPage = 1;
    }

    //第一頁和最後一頁為固定顯示
    //只要頁數計數器-小於3 就直接等於3
    if (count < 3 || currentPage < 4) {
        count = 3;
        //只要頁數計數器-大於18 就直接等於18
    } else if (count > index - 2 || currentPage > index - 3) {
        count = index - 2;
    }
    console.log('當前頁數', currentPage);
    pagination();
    dataRender();
});

//判斷分頁斷點
function pagination() {
    let str = '';

    //總頁數 一頁最多10筆資料
    index = Math.ceil(data.length / 10);

    //將總頁數分成三等份　依照不同等分顯示不同樣式

    //當資料頁數小於6頁的時候的樣式
    if (index < 6) {
        console.log('長度不足6');
        str = `
        <li class="prev" data-btn=prev>
        <i class="fas fa-angle-left" data-btn=prev></i>
            Prev
        </li>
        <li id=1 class="pagBtn" data-num=1>1</li>`;

        for (let i = 2; i < index; i++) {
            str += `<li id=${i} class="pagBtn" data-num=${i}>${i}</li>`;
        }

        str += `
        <li id=${index} class="pagBtn" data-num=${index}>${index}</li>
        <li class="next" data-btn=next>
            Next
        <i class="fas fa-angle-right" data-btn=next></i>
    </li>
    `;
        //如果頁數計數器-超過2等分（總頁數超過2/3) 顯示 1 ... 頁數計數器--1 頁數計數器- 頁數計數器-+1 最後一頁
    } else if (index >= Math.ceil((index / 3) * 2)) {
        console.log('達2/3');
        str = `
        <li class="prev" data-btn=prev>
        <i class="fas fa-angle-left" data-btn=prev></i>
            Prev
        </li>
        <li id=1 class="pagBtn" data-num=1>1</li>
        <li data-num=>...</li>
        <li id=${count - 1} class="pagBtn" data-num=${count - 1}>${
            count - 1
        }</li>
        <li id=${count} class="pagBtn" data-num=${count}>${count}</li>
        <li id=${count + 1} class="pagBtn" data-num=${count + 1}>${
            count + 1
        }</li>
        <li id=${index} class="pagBtn" data-num=${index}>${index}</li>
        <li class="next" data-btn=next>
            Next
        <i class="fas fa-angle-right" data-btn=next></i>
    </li>
    `;
        //如果頁數計數器-超過1等分（總頁數超過1/3) 顯示 1 ... 頁數計數器--1 頁數計數器- 頁數計數器-+1 ... 最後一頁
    } else if (index >= Math.ceil(index / 3)) {
        console.log('達1/3');
        str = `
        <li class="prev" data-btn=prev>
        <i class="fas fa-angle-left" data-btn=prev></i>
            Prev
        </li>
        <li id=1 class="pagBtn" data-num=1>1</li>
        <li data-num=>...</li>
        <li id=${count - 1} class="pagBtn" data-num=${count - 1}>${
            count - 1
        }</li>
        <li id=${count} class="pagBtn" data-num=${count}>${count}</li>
        <li id=${count + 1} class="pagBtn" data-num=${count + 1}>${
            count + 1
        }</li>
        <li data-num=>...</li>
        <li id=${index} class="pagBtn" data-num=${index}>${index}</li>
        <li class="next" data-btn=next>
            Next
        <i class="fas fa-angle-right" data-btn=next></i>
    </li>
    `;
        //如果頁數計數器-沒超過1等分（總頁數未超過1/3) 顯示 1 頁數計數器--1 頁數計數器- 頁數計數器-+1 ... 最後一頁
    } else {
        console.log('未達1/3');
        str = `
        <li class="prev" data-btn=prev>
        <i class="fas fa-angle-left" data-btn=prev></i>
            Prev
        </li>
        <li id=1 class="pagBtn" data-num=1>1</li>
        <li id=${count - 1} class="pagBtn" data-num=${count - 1}>${
            count - 1
        }</li>
        <li id=${count} class="pagBtn " data-num=${count}>${count}</li>
        <li id=${count + 1} class="pagBtn" data-num=${count + 1}>${
            count + 1
        }</li>
        <li data-num=>...</li>
        <li id=${index} class="pagBtn" data-num=${index}>${index}</li>
        <li class="next" data-btn=next>
            Next
        <i class="fas fa-angle-right" data-btn=next></i>
        </li>
    `;
    }
    page.innerHTML = str;
    //當前頁面的分頁按鈕 加入css
    currentPageId = document.getElementById(currentPage);
    currentPageId.classList.add('pagBtnClicked');
}

//資料渲染
function dataRender() {
    let str = '';
    for (let i = (currentPage - 1) * 10; i <= currentPage * 10 - 1; i++) {
        if (i > data.length - 1) {
            break;
        } else {
            str += `
        <tr class="dataList text-center p-3">
            <td class="fw-bold">${data[i]['作物名稱']}</td>
            <td class="fw-bold">${data[i]['市場名稱']}</td>
            <td>${data[i]['上價']}</td>
            <td>${data[i]['中價']}</td>
            <td>${data[i]['下價']}</td>
            <td>${data[i]['平均價']}</td>
            <td>${data[i]['交易量']}</td>
        </tr>
        `;
            //確認每次資料有10筆
            console.log('資料成功顯示');
        }
    }
    showList.innerHTML = str;
}

//上價排序
Upperprice.addEventListener('click', upperSort);

//中價排序
Middleprice.addEventListener('click', middleSort);

//低價排序
Lowerprice.addEventListener('click', lowerSort);

//平均價排序
Averageprice.addEventListener('click', averageSort);

//交易量排序
Tradingvolume.addEventListener('click', tradingSort);

//上價排序函式
function upperSort() {
    if (sorData.Upperprice) {
        data = data.sort(function (a, b) {
            return a['上價'] > b['上價'] ? 1 : -1;
        });
        console.log(fruit);
        console.log(data);
        sorData.Upperprice = !sorData.Upperprice;
        removeArrow();
        Upperprice.classList.add('clickup');
        console.log(sorData.Upperprice);
    } else {
        data = data.sort(function (a, b) {
            return a['上價'] < b['上價'] ? 1 : -1;
        });
        removeArrow();
        Upperprice.classList.add('clickdown');
        sorData.Upperprice = !sorData.Upperprice;
    }
    dataRender();
}

//中價排序函式
function middleSort() {
    if (sorData.Middleprice) {
        data = data.sort(function (a, b) {
            return a['中價'] > b['中價'] ? 1 : -1;
        });
        removeArrow();
        Middleprice.classList.add('clickup');
        sorData.Middleprice = !sorData.Middleprice;
    } else {
        data = data.sort(function (a, b) {
            return a['中價'] < b['中價'] ? 1 : -1;
        });
        data;
        removeArrow();
        Middleprice.classList.add('clickdown');
        sorData.Middleprice = !sorData.Middleprice;
    }

    dataRender();
}

//低價排序函式
function lowerSort() {
    if (sorData.Lowerprice) {
        data = data.sort(function (a, b) {
            return a['下價'] > b['下價'] ? 1 : -1;
        });
        removeArrow();
        Lowerprice.classList.add('clickup');
        sorData.Lowerprice = !sorData.Lowerprice;
    } else {
        data = data.sort(function (a, b) {
            return a['下價'] < b['下價'] ? 1 : -1;
        });
        data;
        removeArrow();
        Lowerprice.classList.add('clickdown');
        sorData.Lowerprice = !sorData.Lowerprice;
    }
    dataRender();
}

//平均價排序
function averageSort() {
    if (sorData.Averageprice) {
        data = data.sort(function (a, b) {
            return a['平均價'] > b['平均價'] ? 1 : -1;
        });
        removeArrow();
        Averageprice.classList.add('clickup');
        sorData.Averageprice = !sorData.Averageprice;
    } else {
        data = data.sort(function (a, b) {
            return a['平均價'] < b['平均價'] ? 1 : -1;
        });
        data;
        removeArrow();
        Averageprice.classList.add('clickdown');
        sorData.Averageprice = !sorData.Averageprice;
    }
    dataRender();
}

//交易量排序
function tradingSort() {
    if (sorData.Tradingvolume) {
        data = data.sort(function (a, b) {
            return a['交易量'] > b['交易量'] ? 1 : -1;
        });
        removeArrow();
        Tradingvolume.classList.add('clickup');
        sorData.Tradingvolume = !sorData.Tradingvolume;
    } else {
        data = data.sort(function (a, b) {
            return a['交易量'] < b['交易量'] ? 1 : -1;
        });
        data;
        removeArrow();
        Tradingvolume.classList.add('clickdown');
        sorData.Tradingvolume = !sorData.Tradingvolume;
    }
    dataRender();
}

//Select清單選擇
jsSelect.addEventListener('change', jsSort);
jsMoblieSelect.addEventListener('change', jsSort);

function jsSort(e) {
    switch (e.target.value) {
        case '依上價排序':
            upperSort();
            break;
        case '上價':
            upperSort();
            break;
        case '依中價排序':
            middleSort();
            break;
        case '中價':
            middleSort();
            break;
        case '依下價排序':
            lowerSort();
            break;
        case '下價':
            lowerSort();
            break;
        case '依平均價排序':
            averageSort();
            break;
        case '平均價':
            averageSort();
            break;
        case '依交易量排序':
            tradingSort();
            break;
        case '交易量':
            tradingSort();
            break;
    }
    console.log(e.target.value);
}

//搜尋功能
searchBtn.addEventListener('click', function () {
    let key = roundedEnd.value.trim();
    let searchData = [];
    //搜尋data裡每一筆資料的作物名稱
    data.forEach(function (item) {
        if (item['作物名稱'].indexOf(key) != -1) {
            //先存放在searchData
            searchData.push(item);
        }
    });
    //顯示查詢某某某比價結果
    showResult.innerHTML = `查詢「${key}」的比價結果`;
    //如果沒有找到 就直接innerHtml
    //清空分頁按鈕
    if (searchData.length <= 0) {
        showList.innerHTML = `<td class="text-center p-3" colspan="7">查詢不到當日的交易資訊QQ</td>`;
        page.innerHTML = '';
    } else {
        //有的話就渲染出來
        data = searchData;
        dataRender();
        pagination();
    }
    console.log(searchData);
    roundedEnd.value = '';
});

//reset箭頭css
function removeArrow() {
    Upperprice.classList.remove('clickup');
    Upperprice.classList.remove('clickdown');
    Middleprice.classList.remove('clickup');
    Middleprice.classList.remove('clickdown');
    Lowerprice.classList.remove('clickup');
    Lowerprice.classList.remove('clickdown');
    Averageprice.classList.remove('clickup');
    Averageprice.classList.remove('clickdown');
    Tradingvolume.classList.remove('clickup');
    Tradingvolume.classList.remove('clickdown');
}
