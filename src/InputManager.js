class InputManager
{
    observer = [];

    subscribe(fn) {
        this.observer.push(fn);
    }
    unsubscribe(fn) {
        this.observer = this.observer.filter(subscriber => subscriber !== fn);
    }

    broadcast(action) {
        this.observer.forEach(subscriber => subscriber(action));
    }

    handleKeys = e => {
        e.preventDefault();
        switch (e.keyCode)
        {
            //left-arrow
            case 37:
                this.broadcast('moveLeft');
                break;
            //up-arrow?
            case 38:    
                this.broadcast('jump');
                break;
            case 39:
                this.broadcast('moveRight');
                break;
            default:
                break;    
        }
    };

    bindKeys() {
        document.addEventListener('keydown', this.handleKeys);
    }
    unbindKeys() {
        document.removeEventListener('keydown', this.handleKeys);
    }
}

export default InputManager;
