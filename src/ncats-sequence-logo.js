import {select} from "d3";

import ProtvistaZoomable from "protvista-zoomable";

const NUMBER_OF_TICKS = 3;

class NcatsSequenceLogo extends ProtvistaZoomable {

    connectedCallback() {
        super.connectedCallback();

        this.sequence = this.getAttribute("sequence");
        if (this.sequence) {
            this._createSequence();
        }
        this.addEventListener("load", e => {
            this.data = e.detail.payload;
        });
    }

    constructor() {
        super();
        this.pathmap = new Map();
        this.pathmap.set('A', "M 19.488399282388276 70.12406110220273 L 80.41484408071116 70.12406110220273 L 94.48890322320547 100 L 100.00000000000001 100 L 53.05085770727086 0 L 46.949142292729135 0 L 0 100 L 5.511096776794533 100 L 19.488399282388276 70.12406110220273 Z M 78.74176056763893 66.41488733226434 L 21.1614827954605 66.41488733226434 L 50.00100788163438 5.082004107238305 L 78.74176056763893 66.41488733226434 Z");
        this.pathmap.set('B', "M 0 0 L 0 100 L 51.368790181180586 100 Q 61.29982466393922 99.86215433088587 70.20455873758036 97.90558978254143 A 20.804 20.804 0 0 0 85.84219754529516 92.37629054491237 A 18.405 18.405 0 0 0 96.28755113968438 83.79047458294653 A 18.485 18.485 0 0 0 100.00000000000001 72.82330435761106 A 23.89 23.89 0 0 0 99.9976621858562 72.45899794638086 Q 99.9976621858562 67.7891242580246 97.25774400935126 63.77050102680959 A 17.704 17.704 0 0 0 89.83752191700758 56.594086702112705 Q 85.04266510812391 53.433482431710146 78.65108123904149 51.3053140912032 Q 72.25949736995909 49.17573916223592 64.95382817066044 48.215039243818055 L 64.83927527761541 47.87042507103273 A 28.096 28.096 0 0 0 76.31092928112217 44.47070076237094 Q 81.50555230859148 42.5141362140265 85.27177089421392 39.767068950966326 Q 88.92577440093514 37.087517934002875 90.92226767971948 33.58511266773567 A 17.405 17.405 0 0 0 92.92109877264755 25.61819562832307 A 16.748 16.748 0 0 0 88.58211572180011 14.217796157200326 A 16.896 16.896 0 0 0 77.05201636469901 6.250879117787719 A 22.171 22.171 0 0 0 60.558737580362376 1.6147635524798158 A 32.175 32.175 0 0 0 41.32320280537697 0 L 0 0 Z M 6.050263004091192 96.2908262300616 L 6.050263004091192 50.6174923340929 L 52.39742840444187 50.6174923340929 Q 60.388077147866746 50.75533800320704 67.80596142606663 52.266014009621074 A 18.927 18.927 0 0 1 81.04734073641146 56.525163867555634 Q 86.75628287551139 59.34115396517288 90.29339567504384 63.39353531943625 A 13.854 13.854 0 0 1 93.83284628872003 72.59543702703463 A 20.095 20.095 0 0 1 93.8375219170076 72.94989731904242 A 15.624 15.624 0 0 1 90.52250146113384 82.45140236869497 Q 87.09760374050262 86.81323318423497 81.27644652250146 89.83458519706305 Q 75.45528930450031 92.85734379835148 67.6937463471654 94.53962359692801 A 21.289 21.289 0 0 1 51.368790181180586 96.2908262300616 L 6.050263004091192 96.2908262300616 Z M 43.60724722384571 46.909725152614854 L 6.050263004091192 46.909725152614854 L 6.050263004091192 3.7091737699383915 L 41.32320280537697 3.7091737699383915 Q 49.77206312098188 3.7780966044954574 57.9333722969024 5.014487861141587 A 20.091 20.091 0 0 1 72.48626534190531 8.791177877176697 A 14.167 14.167 0 0 1 82.76095850379896 15.487945536894815 A 13.906 13.906 0 0 1 86.6417299824664 25.343910878555157 A 14.284 14.284 0 0 1 83.04617182933958 34.9931077165443 Q 79.45061367621273 39.01173094775931 73.51490356516656 41.62095254170535 Q 67.46464056107538 44.29909697020845 59.70309760374052 45.5706529383633 Q 51.93921683226183 46.84080231805779 43.60724722384571 46.909725152614854 Z");
        this.pathmap.set('C', "M 100 68.85010266940449 L 94.35550708833148 68.85010266940449 Q 92.8636859323882 74.53114305270361 89.56161395856051 79.57700205338809 A 22.206 22.206 0 0 1 80.93565976008722 88.3668720054757 A 18.213 18.213 0 0 1 67.94329334787349 94.28336755646816 A 18.526 18.526 0 0 1 50.96837513631403 96.39014373716633 A 25.665 25.665 0 0 1 50.37295528898579 96.38877481177275 Q 42.279171210468924 96.38877481177275 35.88876772082878 94.65023956194386 A 17.465 17.465 0 0 1 24.599781897491837 89.9712525667351 Q 19.594329334787332 87.03080082135523 16.08069792802618 83.15400410677616 A 32.003 32.003 0 0 1 10.329334787350062 74.93223819301848 A 35.809 35.809 0 0 1 6.922573609596492 66.10951403148528 Q 5.8560523446019666 61.56331279945242 5.751363140676117 57.28542094455851 L 5.751363140676117 42.580424366872 A 49.376 49.376 0 0 1 6.922573609596492 33.82477754962354 Q 7.98691384950925 29.27857631759069 10.329334787350062 24.93360711841205 Q 12.567066521264993 20.655715263518132 16.1330425299891 16.77891854893908 A 22.221 22.221 0 0 1 24.599781897491837 9.96167008898015 A 17.486 17.486 0 0 1 35.9411123227917 5.382614647501711 A 17.491 17.491 0 0 1 50.37295528898579 3.611225188227241 A 25.122 25.122 0 0 1 50.96183206106869 3.609856262833675 A 18.244 18.244 0 0 1 67.78407851690291 5.716632443531827 Q 75.29116684841874 7.889117043121148 80.7241003271537 11.633127994524296 A 22.132 22.132 0 0 1 89.5092693565976 20.388774811772755 Q 92.8636859323882 25.401779603011633 94.35550708833148 31.017111567419573 L 100 31.017111567419573 Q 98.8266085059978 24.59958932238193 95.04689203925842 18.918548939082815 A 23.974 23.974 0 0 0 84.98364231188656 9.02532511978097 Q 78.70010905125405 4.8145106091718 69.96728462377315 2.3750855578370973 A 21.214 21.214 0 0 0 50.95092693565976 0 A 27.026 27.026 0 0 0 50.37295528898579 0.002737850787132101 Q 41.4263904034896 0.06844626967830252 34.292257360959645 1.9069130732375084 Q 27.155943293347885 3.745379876796714 21.618320610687 6.887063655030801 A 23.645 23.645 0 0 0 12.034896401308615 14.239561943874055 A 35.95 35.95 0 0 0 5.323882224645588 23.12936344969199 A 40.751 40.751 0 0 0 1.3849509269356706 32.921286789869946 Q 0.10687022900761696 37.968514715947975 0 42.71457905544147 L 0 57.28542094455851 Q 0.10687022900761696 62.09856262833675 1.3849509269356706 67.07871321013003 A 40.96 40.96 0 0 0 5.323882224645588 76.80355920602327 A 36.373 36.373 0 0 0 11.980370774263891 85.76043805612592 Q 15.973827699018532 89.9712525667351 21.618320610687 93.11293634496919 A 20.213 20.213 0 0 0 34.292257360959645 98.12594113620808 A 18.959 18.959 0 0 0 50.37295528898579 99.99726214921286 A 27.185 27.185 0 0 0 50.94874591057796 100 A 20.926 20.926 0 0 0 70.01962922573608 97.59206023271732 Q 78.70010905125405 95.11841204654345 84.98364231188656 90.84052019164955 Q 91.26717557251904 86.62970568104036 95.04689203925842 80.9472963723477 Q 98.8266085059978 75.26625598904859 100 68.85010266940449 Z");
        this.pathmap.set('D', "M 0 0 L 0 100 L 40.220106677469474 100 A 24.817 24.817 0 0 0 57.63734161546602 98.07719357470391 A 24.288 24.288 0 0 0 72.30886953390504 93.20055138267645 A 25.727 25.727 0 0 0 84.01188305988795 86.02273046951925 A 32.793 32.793 0 0 0 92.63835437625191 77.05994880018005 Q 96.15601017261945 72.25222944270966 98.07800508630976 66.89594058570344 Q 100 61.538245140236874 100 56.1130334486736 L 100 43.88696655132642 Q 99.89197218283714 38.46175485976313 98.0239911777283 33.104059414296565 Q 96.15601017261945 27.74777055729035 92.63835437625191 22.94005119981996 A 32.793 32.793 0 0 0 84.01188305988795 13.977269530480772 A 26.871 26.871 0 0 0 72.30886953390504 6.730525782766478 A 25.109 25.109 0 0 0 57.63734161546602 1.9228064252960868 A 24.817 24.817 0 0 0 40.220106677469474 0 L 0 0 Z M 5.71422141201363 96.2908262300616 L 5.71422141201363 3.7091737699383915 L 40.220106677469474 3.7091737699383915 A 24.048 24.048 0 0 1 52.58254000405106 4.842884068979099 A 21.371 21.371 0 0 1 63.40782751558529 7.5547866205305665 A 21.498 21.498 0 0 1 77.36367114531993 14.732607533687796 A 31.951 31.951 0 0 1 87.25271757477553 24.381804371676935 Q 90.43953818108164 28.846316144822346 92.19949136902757 33.756716459898165 A 34.381 34.381 0 0 1 94.06747237413636 43.681604636115566 L 94.06747237413636 56.1130334486736 Q 93.95719397744925 61.05719188679777 92.30976976571473 65.90007595577687 A 33.981 33.981 0 0 1 87.58355276483695 75.13714237488398 A 29.902 29.902 0 0 1 79.78079355434029 83.41350887557319 Q 75.16485495014967 87.225363603117 69.232327324286 90.04135370073425 A 22.13 22.13 0 0 1 56.043931312312964 94.50586547387967 A 22.11 22.11 0 0 1 40.220106677469474 96.2908262300616 L 5.71422141201363 96.2908262300616 Z");
        this.pathmap.set('E', "M 6.424546334682106 50.41213041888206 L 88.48645830747454 50.41213041888206 L 88.48645830747454 46.70295664894366 L 6.424546334682106 46.70295664894366 L 6.424546334682106 3.7091737699383915 L 100 3.7091737699383915 L 100 0 L 0 0 L 0 100 L 100 100 L 100 96.2908262300616 L 6.424546334682106 96.2908262300616 L 6.424546334682106 50.41213041888206 Z");
        this.pathmap.set('F', "M 6.2876105098932396 50.82426083776409 L 88.75461231767414 50.82426083776409 L 88.75461231767414 46.97864798717192 L 6.2876105098932396 46.97864798717192 L 6.2876105098932396 3.7091737699383915 L 100 3.7091737699383915 L 100 0 L 0 0 L 0 100 L 6.2876105098932396 100 L 6.2876105098932396 50.82426083776409 Z");
        this.pathmap.set('G', "M 100 88.23617994140679 L 99.89369549182112 54.545081181721116 L 52.64893478543852 54.545081181721116 L 52.64893478543852 58.22221613777621 L 94.38538638434511 58.22221613777621 L 94.38538638434511 86.56463050680394 Q 90.78404998481366 89.43953125427812 85.96346596086265 91.34381074939081 A 21.54 21.54 0 0 1 75.63674230919433 94.38572954028967 Q 70.12843320171822 95.52199983571995 64.30121056970542 95.99019795745147 A 36.326 36.326 0 0 1 54.34763743654282 96.39952906387757 A 33.132 33.132 0 0 1 52.96567883021661 96.39131506174192 A 18.866 18.866 0 0 1 38.18935219334406 94.65268460969801 Q 31.568099969627383 92.9825041754511 26.378704386688057 90.10760342797688 A 20.497 20.497 0 0 1 17.266889399921908 83.45699969881994 A 32.357 32.357 0 0 1 10.912483186531935 75.2676395695863 A 35.931 35.931 0 0 1 7.098537770642582 66.34449524956878 A 42.903 42.903 0 0 1 5.720918123833906 57.218738876872116 L 5.720918123833906 41.17679270596611 Q 5.827222632012921 36.89866659365332 7.098537770642582 32.45352243791584 Q 8.369852909272366 28.008378282178356 10.80617867835292 23.795964186950687 A 30.122 30.122 0 0 1 16.950145355143814 15.976234153820881 Q 20.657786262854152 12.299099197765793 25.74304681737329 9.558360485173727 A 18.022 18.022 0 0 1 37.13064607107218 5.213153355419872 Q 43.53928927843108 3.608684938258085 51.37761964680874 3.608684938258085 Q 60.27682561721698 3.608684938258085 67.37319390810086 5.414396407743067 A 18.303 18.303 0 0 1 79.87373627804055 10.427675711195686 A 20.918 20.918 0 0 1 88.7707727686901 18.04753169235824 Q 92.37210916822154 22.45981983955316 94.17494684774591 27.672973194973032 L 99.78739098364223 27.672973194973032 A 25.261 25.261 0 0 0 94.491690892524 16.61008131862115 Q 90.46730594003557 11.563946006625963 84.21703475506578 7.81973003312981 Q 77.86045906191698 4.1439640774306605 69.54484314661354 2.07129753853736 A 22.601 22.601 0 0 0 51.37761964680874 0 Q 42.691022692758274 0 35.5404174079056 1.7372614516879774 Q 28.389812123052923 3.4758919037318954 22.775198507397906 6.4835856857322804 A 23.851 23.851 0 0 0 12.819455894476489 13.502450510637138 A 31.53 31.53 0 0 0 5.827222632012921 22.058702735262713 Q 2.9678483099752575 26.670864934424884 1.5359916691977848 31.584207211893876 Q 0.10630450817901467 36.49754948936287 0 41.30958574049229 L 0 57.218738876872116 A 43.866 43.866 0 0 0 1.5902286631665818 67.31374750157435 Q 3.0719833383954462 72.39273882211211 6.039831648370703 77.1390630561564 A 32.991 32.991 0 0 0 13.242504447433598 86.02935136763136 Q 17.585802924458704 90.17468444541797 23.4108560767128 93.2494592448594 Q 29.23807870872572 96.32423404430084 36.59912353017748 98.1285765134299 A 21.383 21.383 0 0 0 52.96567883021661 100 A 41.762 41.762 0 0 0 65.99557426129219 99.39900884374231 A 29.694 29.694 0 0 0 78.70872564758977 97.39342332229008 A 26.014 26.014 0 0 0 90.30676443788788 93.75051337513348 A 19.404 19.404 0 0 0 100 88.23617994140679 Z");
        this.pathmap.set('H', "M 94.16299559471368 100 L 100 100 L 100 0 L 94.16299559471368 0 L 94.16299559471368 46.70295664894366 L 5.834661167869552 46.70295664894366 L 5.834661167869552 0 L 0 0 L 0 100 L 5.834661167869552 100 L 5.834661167869552 50.41213041888206 L 94.16299559471368 50.41213041888206 L 94.16299559471368 100 Z");
        this.pathmap.set('I', "M 100 0 L 0 0 L 0 3.8470194390525223 L 45.534239613772016 3.8470194390525223 L 45.534239613772016 96.2908262300616 L 0 96.2908262300616 L 0 100 L 100 100 L 100 96.2908262300616 L 52.73027569559148 96.2908262300616 L 52.73027569559148 3.8470194390525223 L 100 3.8470194390525223 L 100 0 Z");
        this.pathmap.set('J', "M 99.99999999999999 0 L 93.72766971020238 0 L 93.84209420171389 68.69987512140975 A 23.072 23.072 0 0 1 90.42103542488854 79.33675593173305 A 19.53 19.53 0 0 1 81.52628260514196 88.07686971000417 Q 75.82607477290246 91.87040377410851 67.8443826915443 94.07242958235051 A 18.391 18.391 0 0 1 50.05721224575563 96.34244484528931 A 26.046 26.046 0 0 1 49.34264297223456 96.34521992507285 A 20.515 20.515 0 0 1 32.44051094038238 94.64825863743583 A 16.316 16.316 0 0 1 18.929080167199867 89.635077008464 Q 13.226537141255845 86.3826835021507 9.978282698549641 81.77605106146802 A 21.745 21.745 0 0 1 6.272330289797359 71.47772998473708 L 0 71.47772998473708 A 25.855 25.855 0 0 0 4.390164164117405 83.1649784931317 Q 8.096116572869688 88.41542944359651 14.594960651986089 92.14097405300403 A 18.987 18.987 0 0 0 30.046937393456712 97.96864159844596 A 23.844 23.844 0 0 0 50.05721224575563 100 A 20.458 20.458 0 0 0 70.35238072998148 97.49410295545998 Q 79.47598253275112 94.98681837102816 85.97482661186751 90.71874566393785 A 22.602 22.602 0 0 0 96.12124325712803 80.79367281809353 Q 99.77115101697669 75.13667267933954 99.99999999999999 68.69987512140975 L 99.99999999999999 0 Z");
        this.pathmap.set('K', "M 5.496622791825396 62.019298393675996 L 28.01350883269817 47.52721748670774 L 92.91652234153091 100 L 100 100 L 32.0293557325943 44.9179958927617 L 95.13768617942505 0 L 87.31382057499131 0 L 28.43565985452024 41.8263144569162 L 5.496622791825396 57.62370945508764 L 5.496622791825396 0 L 0 0 L 0 100 L 5.496622791825396 100 L 5.496622791825396 62.019298393675996 Z");
        this.pathmap.set('L', "M 100 96.2908262300616 L 6.665342700394851 96.2908262300616 L 6.665342700394851 0 L 0 0 L 0 100 L 100 100 L 100 96.2908262300616 Z");
        this.pathmap.set('M', "M 48.58198893486445 62.843559231440075 L 8.968338834906454 0 L 0 0 L 0 100 L 6.129992096331897 100 L 6.129992096331897 51.374236925760265 L 6.0160862894604055 5.700903029791545 L 45.6297363894184 67.72020142346753 L 51.30642986656751 67.72020142346753 L 94.09781951741135 5.014487861141587 L 93.87000790366837 51.374236925760265 L 93.87000790366837 100 L 100 100 L 100 0 L 90.46445673903953 0 L 48.58198893486445 62.843559231440075 Z");
        this.pathmap.set('N', "M 94.26038703002651 100 L 99.99999999999999 100 L 99.99999999999999 0 L 94.02995603000284 0 L 94.26038703002651 93.47483613244438 L 5.7396129699734875 0 L 0 0 L 0 100 L 5.8548284699851925 100 L 5.626748806696661 6.318395363884437 L 94.26038703002651 100 Z");
        this.pathmap.set('O', "M 100.00000000000001 57.28581989431318 L 100.00000000000001 42.71418010568683 Q 99.89369549182112 37.96785587164253 98.62238035319132 32.95457656818991 A 43.86 43.86 0 0 0 94.80843493730197 23.194973030692985 A 36.373 36.373 0 0 0 88.1893521933441 14.237603701776964 A 24.1 24.1 0 0 0 78.70872564758976 6.817621772581663 A 20.481 20.481 0 0 0 65.99557426129215 1.8371984776716046 A 19.263 19.263 0 0 0 49.99999999999988 0 A 19.263 19.263 0 0 0 34.00442573870786 1.8371984776716046 Q 26.908057447823847 3.675765955699149 21.399748340347838 6.817621772581663 Q 15.78513472469294 10.02655860690524 11.812817286414596 14.237603701776964 Q 7.840499848136252 18.44864879664869 5.29786957087668 23.194973030692985 A 40.853 40.853 0 0 0 1.3776196468086774 32.95457656818991 A 49.526 49.526 0 0 0 0 42.71418010568683 L 0 57.28581989431318 A 47.411 47.411 0 0 0 1.4296871610187718 67.04542343181011 Q 2.755239293617355 72.05870273526273 5.404174079055818 76.80502696930702 Q 7.9446348765564405 81.55135120335132 11.97118930880358 85.76239629822305 Q 15.99557426129202 89.97344139309477 21.61018787694692 93.11529720997729 A 19.203 19.203 0 0 0 34.269102269275734 98.16280152232841 A 19.312 19.312 0 0 0 50.21260901635791 100 Q 59.00551047858727 100 66.15394628368112 98.16280152232841 Q 73.30455156853394 96.32423404430084 78.81286067600995 93.11529720997729 Q 84.32116978348596 89.97344139309477 88.295656701523 85.76239629822305 Q 92.26797413980134 81.55135120335132 94.80843493730197 76.80502696930702 A 43.86 43.86 0 0 0 98.62238035319132 67.04542343181011 A 49.526 49.526 0 0 0 100.00000000000001 57.28581989431318 Z M 94.3853863843451 42.5800180708047 L 94.3853863843451 57.28581989431318 A 52.52 52.52 0 0 1 93.2724432681043 66.11039618870302 Q 92.26797413980134 70.65547737042412 90.04208790731974 75.00068450017798 A 32.003 32.003 0 0 1 84.32116978348596 83.22290063795418 A 21.67 21.67 0 0 1 75.9534863539724 90.04052241053584 A 17.003 17.003 0 0 1 64.67219160845227 94.6869096185965 A 17.012 17.012 0 0 1 50.21260901635791 96.39131506174192 A 17.012 17.012 0 0 1 35.753026424263304 94.6869096185965 A 17.003 17.003 0 0 1 24.47173167874341 90.04052241053584 Q 19.49277563240316 87.09990964597652 15.99557426129202 83.22290063795418 A 32.003 32.003 0 0 1 10.276825617216932 75.00068450017798 Q 8.050939384735333 70.65547737042412 6.992233262463576 66.11039618870302 Q 5.933527140191573 61.56394600662597 5.827222632012681 57.28581989431318 L 5.827222632012681 42.5800180708047 A 49.376 49.376 0 0 1 6.992233262463576 33.82389179421187 Q 8.050939384735333 29.277441612134822 10.276825617216932 24.93223448238097 A 33.012 33.012 0 0 1 15.943506747081926 16.711387344960713 Q 19.38647112422427 12.83437833693837 24.36542717056452 9.892396572023111 Q 29.238078708725634 7.018864824904856 35.594654401874315 5.313090381403499 A 16.832 16.832 0 0 1 49.99999999999988 3.608684938258085 A 17.012 17.012 0 0 1 64.45958259209448 5.313090381403499 Q 70.86822579945326 7.018864824904856 75.84718184579326 9.892396572023111 A 21.67 21.67 0 0 1 84.21703475506577 16.711387344960713 A 32.508 32.508 0 0 1 89.93578339914085 24.86652246529584 Q 92.16166963162244 29.210360594693753 93.22037575389422 33.7568107767708 Q 94.2790818761662 38.30189195849191 94.3853863843451 42.5800180708047 Z");
        this.pathmap.set('P', "M 6.123159801235442 100 L 6.123159801235442 57.76155512420178 L 50.34133655319753 57.76155512420178 Q 60.77183857335255 57.692632289644706 69.84163841545524 55.66573831828285 Q 78.9114382575582 53.64025093538134 85.60117029675378 49.93107716544295 Q 92.29090233594937 46.221903395504555 96.1454511679748 41.003460207612456 Q 100 35.78361043126002 100 29.189523729147325 Q 100 22.596843615494983 96.203501602192 17.272906293076772 A 19.596 19.596 0 0 0 85.71494914781954 8.10476270852674 A 20.59 20.59 0 0 0 69.95541726652125 2.232255886572707 Q 60.8856174244183 0.1378456691141307 50.34133655319753 0 L 0 0 L 0 100 L 6.123159801235442 100 Z M 50.34133655319753 54.05238135426338 L 6.123159801235442 54.05238135426338 L 6.123159801235442 3.7091737699383915 L 50.34133655319753 3.7091737699383915 Q 59.52491524636598 3.8470194390525223 67.51729902939668 5.700903029791545 A 18.433 18.433 0 0 1 81.40528491153107 10.851829971586914 A 17.46 17.46 0 0 1 90.53313518785122 18.887669845556587 A 18.463 18.463 0 0 1 93.87916221613345 29.32736939826146 A 17.147 17.147 0 0 1 90.41935633678546 39.560300447295134 A 16.37 16.37 0 0 1 81.06627037570243 47.25293273693983 A 17.93 17.93 0 0 1 67.23401291041662 52.23225588657271 A 21.911 21.911 0 0 1 50.34133655319753 54.05238135426338 Z");
        this.pathmap.set('Q', "M 99.99999999999999 49.2804315055587 L 99.99999999999999 36.74510081025061 A 44.087 44.087 0 0 0 98.50181907370302 28.090258149613717 A 40.961 40.961 0 0 0 94.40992519314881 19.60853589598643 A 35.04 35.04 0 0 0 87.5240158606875 11.960618051629924 Q 83.43212198013329 8.395750895044284 77.944242325144 5.692952703975882 A 21.746 21.746 0 0 0 65.36810693700679 1.5239306576220089 A 21.225 21.225 0 0 0 49.89984875117517 0 A 21.225 21.225 0 0 0 34.429546662306365 1.5239306576220089 Q 27.445529984057526 3.0466836254004153 21.95560642603105 5.692952703975882 A 24.673 24.673 0 0 0 12.275681641662851 11.960618051629924 Q 8.183787761108645 15.525485208215565 5.487879654989283 19.60853589598643 A 39.55 39.55 0 0 0 1.447083350365796 28.090258149613717 Q 0.10015124882471105 32.488929715470135 0 36.74510081025061 L 0 49.2804315055587 Q 0.10015124882471105 53.593131712832125 1.447083350365796 57.96353872244207 Q 2.7940154519068807 62.33394573205202 5.588030903813994 66.41699641982288 A 32.991 32.991 0 0 0 12.37378898745037 74.0649142641794 A 23.677 23.677 0 0 0 22.055757674855993 80.27605049934051 A 20.387 20.387 0 0 0 34.580795487062026 84.50277934803091 A 21.425 21.425 0 0 0 50.098107345787405 86.02553231580931 Q 54.59060622164092 86.02553231580931 58.68250010219512 85.56623327680423 Q 62.77439398274933 85.10575654795554 66.46568286800469 84.30139438477482 L 92.51318317459017 100 L 96.30666721170745 97.98732805728284 L 71.6551526795568 82.86343508573582 A 21.478 21.478 0 0 0 84.08003924293837 76.79715470133785 Q 89.32060663042141 73.08743169398907 92.91378816988926 68.54508196721312 Q 96.40681846053216 64.05926135293011 98.15231165433512 59.08469945355192 A 44.599 44.599 0 0 0 99.99999999999999 49.2804315055587 Z M 94.61022769079824 36.62968720557754 L 94.61022769079824 49.2804315055587 Q 94.51007644197352 53.13383267382704 93.36140293504467 57.1297343131713 A 38.476 38.476 0 0 1 89.91947022033273 64.86480120595441 A 32.357 32.357 0 0 1 83.93083432121965 71.9085641605427 A 21.073 21.073 0 0 1 75.44863671667406 77.63095911060863 Q 70.45742549973419 80.1029300923309 64.17037975718418 81.51144714527982 A 18.861 18.861 0 0 1 50.098107345787405 82.92114188807237 A 18.861 18.861 0 0 1 36.02787883742782 81.51144714527982 A 18.235 18.235 0 0 1 24.849773126762877 77.63095911060863 Q 19.86060581286019 75.21551724137933 16.216326697461394 71.9085641605427 Q 12.574091485100025 68.60278876954966 10.278788374279507 64.86480120595441 A 37.183 37.183 0 0 1 6.685606834811665 57.1297343131713 A 42.903 42.903 0 0 1 5.38772840616434 49.2804315055587 L 5.38772840616434 36.62968720557754 Q 5.487879654989283 32.77746372715282 6.685606834811665 28.80864895421142 A 37.301 37.301 0 0 1 10.278788374279507 21.104201997361972 A 29.616 29.616 0 0 1 16.167273024567635 14.087525909176561 A 21.631 21.631 0 0 1 24.749621877938164 8.338044092707745 A 18.883 18.883 0 0 1 35.87663001267216 4.51408517052949 A 18.667 18.667 0 0 1 49.89984875117517 3.1043904277369516 A 18.861 18.861 0 0 1 63.972121162571945 4.51408517052949 A 19.494 19.494 0 0 1 75.24833421902464 8.338044092707745 Q 80.13939418713981 10.810015074429998 83.78162939950118 14.087525909176561 A 31.309 31.309 0 0 1 89.81931897150803 21.04649519502544 A 40.106 40.106 0 0 1 93.31234926215092 28.78038439796495 A 42.903 42.903 0 0 1 94.61022769079824 36.62968720557754 Z");
        this.pathmap.set('R', "M 5.855762356143375 57.2115790362056 L 54.053368389492476 57.2115790362056 L 93.80751401093214 100 L 100 100 L 100 99.03789349312179 L 59.79842708549556 56.1130334486736 A 31.407 31.407 0 0 0 73.47955441776797 51.78636734464231 Q 79.72969856315885 49.24466199679299 84.2339537350954 45.878695811179576 Q 88.7405152332848 42.5141362140265 91.27286145898178 38.29015106760065 Q 93.80751401093214 34.066165921174786 93.80751401093214 28.846316144822346 A 20.025 20.025 0 0 0 89.92135427477547 17.13646721242299 A 19.798 19.798 0 0 0 79.39297493023383 8.10476270852674 A 21.156 21.156 0 0 0 63.626928665329224 2.232255886572707 A 24.662 24.662 0 0 0 44.48211443990859 0 L 0 0 L 0 100 L 5.855762356143375 100 L 5.855762356143375 57.2115790362056 Z M 49.438409557416165 53.50240526626721 L 5.855762356143375 53.50240526626721 L 5.855762356143375 3.7091737699383915 L 44.36910445351597 3.7091737699383915 A 22.603 22.603 0 0 1 61.205286099771484 5.631980195234479 Q 69.14366106229367 7.418347539876781 75.00172974468991 10.646468056376065 A 17.305 17.305 0 0 1 84.29161189141787 18.544462261231608 Q 87.72573168200351 23.145413115030802 87.72573168200351 28.846316144822346 A 18.094 18.094 0 0 1 84.85435549712867 38.29015106760065 Q 81.98297931225328 42.71949812923735 76.91598053460648 46.016541480293704 A 16.433 16.433 0 0 1 64.81007403307275 51.374236925760265 Q 57.77116630918637 53.36596618561342 49.438409557416165 53.50240526626721 Z");
        this.pathmap.set('S', "M 5.620588554674691 72.52690085699423 L 0 72.52690085699423 A 20.081 20.081 0 0 0 4.2415028776196575 83.62401774224463 A 18.403 18.403 0 0 0 14.527093061135993 91.91194589710594 A 21.515 21.515 0 0 0 31.5473992833099 97.9957834789037 A 30.433 30.433 0 0 0 52.068628515582304 100 A 29.531 29.531 0 0 0 69.67097404712754 98.46261260027929 A 22.59 22.59 0 0 0 85.04723639917476 93.85045040111712 A 17.485 17.485 0 0 0 95.86491475730266 86.13065739397094 A 16.05 16.05 0 0 0 100 75.20055855214524 Q 100 68.85113490129508 95.70420241068507 64.23760370177698 Q 91.41057660983788 59.625441502614805 84.83440112932965 56.41787366864717 A 35.792 35.792 0 0 0 69.29959821913309 51.00210826054816 A 86.164 86.164 0 0 0 52.5985449017266 47.192180269966876 A 104.48 104.48 0 0 1 37.85861657074599 44.05032445308436 A 27.916 27.916 0 0 1 24.07210337713116 39.505243271363256 A 16.588 16.588 0 0 1 14.051471386686973 33.021657585630976 Q 10.17917254859353 29.210360594693753 10.17917254859353 23.663171152424503 Q 10.17917254859353 18.515729814089752 13.945053751764663 14.738657832051036 A 14.942 14.942 0 0 1 23.648604625909172 8.489171207184516 Q 29.58627429688354 6.0153875640007675 36.90302964491244 4.812036251129426 Q 44.21978499294135 3.608684938258085 51.432294494516185 3.608684938258085 A 20.211 20.211 0 0 1 67.23205559778441 5.347315390302002 Q 74.44239331089149 7.084576841989981 79.85231838418932 10.226432658872493 A 17.98 17.98 0 0 1 88.60028233250078 17.746351614051424 Q 91.94049299598218 22.125783752703775 92.7896622868929 27.406018125564714 L 98.40807905309985 27.406018125564714 A 21.485 21.485 0 0 0 94.22087088717547 16.10902718834707 Q 90.45498968400483 11.028666867453389 84.19806710826353 7.485693946280428 A 20.862 20.862 0 0 0 69.5124334889782 1.9713605125537335 A 23.74 23.74 0 0 0 51.432294494516185 0 Q 42.94711695080912 0 34.62265175371915 1.503162390822222 A 23.062 23.062 0 0 0 19.617765229666386 5.948306546559704 A 17.958 17.958 0 0 0 8.695841025083938 13.435369493196069 A 14.079 14.079 0 0 0 4.556412205451087 23.509843112559206 A 18.395 18.395 0 0 0 4.5607557823865905 23.795964186950687 A 14.73 14.73 0 0 0 9.438592681072857 35.12718013306684 A 20.73 20.73 0 0 0 21.526767292865717 42.71418010568683 A 32.722 32.722 0 0 0 35.684656314475 47.32634230484901 Q 43.58345097187524 49.26484680886018 51.00662395482645 50.668072173698775 Q 58.32337930285585 52.0726665388933 66.01151047887922 53.976946034005984 Q 73.69964165490258 55.88259452947458 79.95656423064388 58.69041425950772 Q 86.21348680638468 61.49686498918491 90.24432620262746 65.54226104098788 Q 94.27299381040251 69.58628809243493 94.16657617548019 75.33472058702736 A 13.642 13.642 0 0 1 90.50928439569962 84.86022506365852 A 14.404 14.404 0 0 1 80.91215115647742 91.3780357582893 A 19.833 19.833 0 0 1 67.39059615593425 95.15373873997208 A 28.058 28.058 0 0 1 52.068628515582304 96.39131506174192 Q 42.94711695080912 96.39131506174192 34.94190465848608 94.88678367056376 Q 26.934520577695785 93.38225227938558 20.7840156368768 90.37455849738522 A 17.689 17.689 0 0 1 10.550548376587988 82.92172055964735 Q 6.574003692040479 78.47657640390987 5.620588554674691 72.52690085699423 Z");
        this.pathmap.set('T', "M 52.62123728882222 3.7091737699383915 L 100 3.7091737699383915 L 100 0 L 0 0 L 0 3.7091737699383915 L 47.47802131021351 3.7091737699383915 L 47.27950411214205 100 L 52.62123728882222 100 L 52.62123728882222 3.7091737699383915 Z");
        this.pathmap.set('U', "M 100 66.87109754405441 L 100 0 L 94.07758158195517 0 L 93.96328520445063 66.87109754405441 A 27.15 27.15 0 0 1 90.77464952998544 77.87983904537256 Q 87.81460661052938 83.19827945053422 82.23274474586553 87.26377133342585 A 17.947 17.947 0 0 1 68.56616360710053 93.8698487581518 Q 60.479111753866164 96.34244484528931 50.11313008793821 96.34244484528931 A 17.402 17.402 0 0 1 31.606447248722905 93.90314971555433 A 17.6 17.6 0 0 1 17.88155163163902 87.33176078812268 Q 12.18772596860331 83.26626890523104 9.169368570828357 77.94782850006938 A 25.749 25.749 0 0 1 6.036714795549377 66.87109754405441 L 5.9224184180448205 0 L 0.11429637750455628 0 L 0 66.87109754405441 A 28.516 28.516 0 0 0 3.587506706164513 79.4380463438324 A 23.806 23.806 0 0 0 13.440320962888576 89.97363674205634 A 20.059 20.059 0 0 0 29.042942781833485 97.2901345913695 Q 38.26829325184857 100 50.11313008793821 100 Q 61.84600312565599 100 71.07135359567054 97.2901345913695 A 20.574 20.574 0 0 0 86.78827179212054 89.97363674205634 A 23.445 23.445 0 0 0 96.58277157052571 79.4380463438324 Q 100 73.44248647148606 100 66.87109754405441 Z");
        this.pathmap.set('V', "M 0 0 L 46.87924980209873 100 L 53.02332189903996 100 L 100 0 L 94.35118842227023 0 L 52.13022915947788 90.24671561594509 L 49.950270972455996 95.60441106141165 L 47.770312785434584 90.24671561594509 L 5.54935352264177 0 L 0 0 Z");
        this.pathmap.set('W', "M 0 0 L 21.634213128470638 100 L 26.277858066479304 100 L 48.28287822316875 16.621655835935524 L 50.047539362592396 9.341153965172872 L 51.90347607819269 16.621655835935524 L 73.72404350802434 100 L 78.36578687152937 100 L 100 0 L 95.44953221267205 0 L 78.64531832357196 77.33564013840832 L 75.85951167566724 90.11027653529132 L 73.16688217844366 77.33564013840832 L 52.46063740777381 0 L 47.81889404426879 0 L 26.92629497223707 77.33564013840832 L 24.14048832433277 89.97243086617718 L 21.541035977789484 77.33564013840832 L 4.643644938008668 0 L 0 0 Z");
        this.pathmap.set('X', "M 91.88899017522509 0 L 49.95036969512792 46.08546431485077 L 8.108984098045028 0 L 1.6813531854551345 0 L 46.68489820723194 48.97037724702508 L 0 100 L 6.131874810088206 100 L 49.95036969512792 51.853883590739024 L 93.7688645801681 100 L 100 100 L 53.31307606603865 48.97037724702508 L 98.31864681454486 0 L 91.88899017522509 0 Z");
        this.pathmap.set('Y', "M 93.7995121852889 0 L 49.902235481465304 58.65333220806258 L 6.593561652119501 0 L 0 0 L 47.3422161301375 62.019298393675996 L 47.44098853030724 100 L 52.55901146969322 100 L 52.55901146969322 62.019298393675996 L 100 0 L 93.7995121852889 0 Z");
        this.pathmap.set('Z', "M 100 96.2908262300616 L 7.6835359317625285 96.2908262300616 L 97.10584532579195 2.6106281824063915 L 96.99409309644905 0 L 3.89764408055297 0 L 3.89764408055297 3.6402509353813266 L 89.19880493534363 3.6402509353813266 L 0 96.97724139871156 L 0.109471571601254 100 L 100 100 L 100 96.2908262300616 Z");
    }

    static get observedAttributes() {
        return ProtvistaZoomable.observedAttributes.concat(
            "highlightstart",
            "highlightend",
            "sequence"
        );
    }


    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        console.log(`${name} changed from ${oldValue} to ${newValue}`);
        if(name === 'sequence'){
            this.sequence = newValue;
        }
        console.log(this.sequence);
        console.log(super.svg);
        if (this.sequence && !super.svg) {
            console.log('creating');
            this._createSequence();
        } else {
            this.refresh();
        }
    }

    get data() {
        return this.sequence;
    }

    set data(data) {
        if (typeof data === "string") this.sequence = data;
        else if ("sequence" in data) this.sequence = data.sequence;
        if (this.sequence && !super.svg) {
            this._createSequence();
        } else {
            this.refresh();
        }
    }

    _getCharSize() {
        if (!this.seq_g) return;
        const xratio = 0.8;
        const yratio = 1.6;
        const node = this.seq_g.select("path.base").node();
        if (node) {
            this.chWidth = node.getBBox().width * xratio;
            this.chHeight = node.getBBox().height * yratio;
        } else {
            // Add a dummy node to measure the width
            const tempNode = this.seq_g
                .append("text")
                .attr("class", "base")
                .text("T");
            this.chWidth = tempNode.node().getBBox().width * xratio;
            this.chHeight = tempNode.node().getBBox().height * yratio;
            tempNode.remove();
        }
    }

    _createSequence() {
        super.svg = select(this)
            .append("div")
            .attr("class", "")
            .append("svg")
            .attr("id", "")
            .attr("width", this.width)
            .attr("height", this._height);

        this.seq_bg = super.svg.append("g").attr("class", "background");

        this.axis = super.svg.append("g").attr("class", "x axis");

        this.seq_g = super.svg
            .append("g")
            .attr("class", "sequence")
            .attr("transform", `translate(0,${this.standardOffset()})`);

        this.trackHighlighter.appendHighlightTo(this.svg);
        this.refresh();
    }
    standardOffset(){
        return 0.75 * this._height;
    }
    refresh() {
        // this._getCharSize();
        console.log('refreshing');
        if (this.axis) {
            console.log('in this.axis');
            console.log(this.xScale);
            // const widthScale = 2;
            const ftWidth = this.getSingleBaseWidth();
            const opacity = ftWidth - 10;
            const half = ftWidth / 2;
            const first = Math.round(Math.max(0, this._displaystart - 2));
            const last = Math.round(
                Math.min(this.sequence.length, this._displayend + 1)
            );
            const bases = [];
            console.log(ftWidth);
            console.log('opacity:' + opacity);
            try {
                if (opacity > 0) {
                    console.log('in opacity>0');
                    this.sequence
                        .slice(first, last)
                        .forEach((seqObj, i) => {
                            bases.push({
                                start: 1 + first + i,
                                end: 1 + first + i,
                                aa: seqObj[0].aa,
                                bits: seqObj[0].bits,
                                yOffset: seqObj[4].bits + seqObj[3].bits + seqObj[2].bits + seqObj[1].bits
                            });
                            bases.push({
                                start: 1 + first + i,
                                end: 1 + first + i,
                                aa: seqObj[1].aa,
                                bits: seqObj[1].bits,
                                yOffset: seqObj[4].bits + seqObj[3].bits + seqObj[2].bits
                            });
                            bases.push({
                                start: 1 + first + i,
                                end: 1 + first + i,
                                aa: seqObj[2].aa,
                                bits: seqObj[2].bits,
                                yOffset: seqObj[4].bits + seqObj[3].bits
                            });
                            bases.push({
                                start: 1 + first + i,
                                end: 1 + first + i,
                                aa: seqObj[3].aa,
                                bits: seqObj[3].bits,
                                yOffset: seqObj[4].bits
                            });
                            bases.push({
                                start: 1 + first + i,
                                end: 1 + first + i,
                                aa: seqObj[4].aa,
                                bits: seqObj[4].bits,
                                yOffset: 0
                            });
                        });
                    console.log(this.sequence);
                }
            }
            catch (e) {
                console.log(e);
            }


            // only add axis if there is room
            // if (this.height > this.chHeight) {
            //   this.xAxis = axisBottom(this.xScale)
            //     .tickFormat(d => (Number.isInteger(d) ? d : ""))
            //     .ticks(NUMBER_OF_TICKS, "s");
            //   this.axis.call(this.xAxis);
            // }

            // this.axis.attr("transform", `translate(${this.margin.left + half},0)`);
            this.axis.select(".domain").remove();
            this.axis.selectAll(".tick line").remove();

            this.bases = this.seq_g.selectAll("path.base").data(bases, d => d.start);
            this.bases.enter()
                .append("path")
                .attr("class", "base")
                .attr("d", d => this.pathmap.get(d.aa))
                .attr("stroke", d => this.colorByChemistry(d.aa))
                .attr("fill", d => this.colorByChemistry(d.aa))
                .attr('transform',d => {
                    return `translate(${this.getXFromSeqPosition(d.start)}, ${-this.standardOffset()
                    + (100 - (100 * d.bits) - (100 * d.yOffset))}) scale(${ftWidth / 100}, ${d.bits})`;
                });

            this.bases.exit().remove();

            this.bases.attr('transform',d => {
                return `translate(${this.getXFromSeqPosition(d.start)}, ${-this.standardOffset() + (100 - (100 * d.bits) - (100 * d.yOffset))}) scale(${ftWidth / 100}, ${d.bits})`;
            });

            this.background = this.seq_bg
                .selectAll("rect.base_bg")
                .data(bases, d => d.start);

            this.background
                .enter()
                .append("rect")
                .attr("class", "base_bg feature")
                .attr("height", this._height)
                .merge(this.background)
                .attr("width", ftWidth)
                .attr("fill", d => {
                    return Math.round(d.start) % 2 ? "#ddd" : "#eee";
                })
                .attr("x", d => this.getXFromSeqPosition(d.start))
                .call(this.bindEvents, this);
            this.background.exit().remove();

            this.seq_g.style("opacity", Math.min(1, opacity));
            this.background.style("opacity", Math.min(1, opacity));

            this._updateHighlight();
        }
    }

    getXFromSeqPosition(position) {
        return this.margin.left + this.xScale(position);
    }

    colorByChemistry(aa) {
        switch (aa) {
            case 'G':
            case 'S':
            case 'T':
            case 'Y':
            case 'C':
                return "green"; // Polar
            case 'Q':
            case 'N':
                return "purple"; // Neutral
            case 'K':
            case 'R':
            case 'H':
                return "blue"; // Basic
            case 'D':
            case 'E':
                return "red"; // Acidic
            case 'A':
            case 'V':
            case 'L':
            case 'I':
            case 'P':
            case 'W':
            case 'F':
            case 'M':
                return "black"; // Hydrophobic
        }
        return "papayawhip"; // unknown
    }

    _updateHighlight() {
        this.trackHighlighter.updateHighlight();
    }



}

export default NcatsSequenceLogo;
