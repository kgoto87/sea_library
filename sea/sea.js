(function () {
    
    // modes for scroll animation
    var modes = {
        init: 'init',
        once: 'once',
        loop: 'loop'
    };
    
    // Start the sea scroll animation when loaded
    window.addEventListener('load', function () {
        
        var params = init();
        
        window.addEventListener('scroll', function(){
            scrollChecker(params['elements'], params['mode'], params['position']);
        });
        
        window.addEventListener('resize', function(){
            reestTranstitionEvents(params['elements']);
            params['elements'] = document.querySelectorAll('.sea_scroll');
            setTransitionEvents(params['elements']);
            setInitialPositions(params['elements']);
        });
    });

    /**
     * Initial setting
     * @return object params
     **/
    function init() {
        var jsScriptTag         = document.getElementById('sea_js'),
            jsPath              = jsScriptTag.getAttribute('src'),
            cssPath             = jsPath.replace('sea.js', 'sea.css'),
            cssLinkTag          = document.createElement('link'),
            params              = getParams(jsPath),
            seaScrollEls        = document.querySelectorAll('.sea_scroll'),
            seaHoverElements    = document.querySelectorAll('.sea_hover');

        // Put Sea's CSS link tag below the script tag 
        cssLinkTag.setAttribute('rel', 'stylesheet');
        cssLinkTag.setAttribute('href', cssPath);
        document.head.appendChild(cssLinkTag);
        
        // Scrolls
        setTransitionEvents(seaScrollEls);
        setInitialPositions(seaScrollEls);
        scrollChecker(seaScrollEls, modes['init']);
        params['elements'] = seaScrollEls;
        
        // Hovers
        setTransitionEvents(seaHoverElements);
        
        return params;
    }
    
    /**
    * set eventlisteners to detect the start/end of transition animation
    * @param object elements
    **/
    function setTransitionEvents(elements) {
        elements.forEach(function(element){
            element.addEventListener('transitionstart', setTransitionStarted, true);
            element.addEventListener('transitionend', setTransitionEnded, true);
        });
    }
    
    function reestTranstitionEvents(elements) {
        elements.forEach(function(element){
            console.log('reset');
            element.removeEventListener('transitionstart', setTransitionStarted, true);
            element.removeEventListener('transitionend', setTransitionEnded, true);
        });
    }
    
    function setTransitionStarted() {
        this.setAttribute('data-sea-transition-state', 'started');
    }
    
    function setTransitionEnded() {
        this.setAttribute('data-sea-transition-state', 'ended');
    }
    
    /**
    * set initial position of elements for transition animation as a data attribution
    * @param object elements
    **/
    function setInitialPositions(elements) {
        var windowY = window.pageYOffset;
        elements.forEach(function(element){
            var elPosition = windowY + element.getBoundingClientRect().top;
            element.setAttribute('data-sea-initial-position', elPosition);
        });
    }
    
    /**
    * @param string url
    * @return object returnParams
    **/
    function getParams(url) {
        var queryStringPosition = url.indexOf('?'),
            paramsSplitPosition = queryStringPosition + 1,
            params = url.substr(paramsSplitPosition),
            splittedParams = params.split('&'),
            returnParams = {};
        
        splittedParams.forEach(function(param){
            var splittedParam = param.split('=');
            returnParams[splittedParam[0]] = splittedParam[1];
        });
        
        return returnParams;
    }

    /**
    * 'data-sea-status' of all elements will be 'hidden' when run for the first time (mode = 'init')
    * @param object seaScrollEls
    * @param string mode
    * @param int position
    **/
    function scrollChecker(seaScrollEls, mode, position) {
        
        // set default values as IE doesn't support it
        if (mode == undefined) mode = 'loop';
        if (position == undefined) position = '25';
        
        var isBottomOfPage      = (window.innerHeight + window.pageYOffset) >= document.body.offsetHeight,
            isModeInit          = (mode === modes['init']),
            isModeOnce          = (mode === modes['once']),
            bottomPosition      = window.innerHeight * (1 - position * 0.01);
        seaScrollEls.forEach(function(seaScrollEl) {
            
            var elHasTransitionState    = seaScrollEl.hasAttribute('data-sea-transition-state'),
                elTransitionState       = (elHasTransitionState) ? seaScrollEl.getAttribute('data-sea-transition-state') : null,
                elHasScrollStatus       = seaScrollEl.hasAttribute('data-sea-status'),
                elScrollStatus          = (elHasScrollStatus) ? seaScrollEl.getAttribute('data-sea-status') : null;
            
            if (
                elTransitionState === 'started'
                ||
                (isModeOnce && elScrollStatus === 'shown')
            ) return;
            
            var elPosition      = (seaScrollEl.hasAttribute('data-sea-initial-position')) ? seaScrollEl.getAttribute('data-sea-initial-position') : null,
                isOnScreen      = elPosition < (window.pageYOffset + bottomPosition),
                contentStatus   = (!isModeInit && (isBottomOfPage || isOnScreen)) ? 'shown' : 'hidden';

            seaScrollEl.setAttribute('data-sea-status', contentStatus);
        });
    }
})();
