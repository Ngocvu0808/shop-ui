import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'translate',
})
class TranslatePipeStub implements PipeTransform {
    public name = 'translate';

    public transform(query: string, ...args: any[]): any {
        return query;
    }
}

export default TranslatePipeStub;
