export type Card = {
id: string;
title: string;
category: string; // e.g. 'birthday', 'wedding'
tags?: string[];
thumb: string; // image url or base64
full?: string; // full size image
description?: string;
};


export const CARDS: Card[] = [
{
id: 'b-001',
title: 'Birthday Confetti',
category: 'birthday',
tags: ['funny', 'kids'],
thumb: 'https://picsum.photos/seed/b1/400/300',
full: 'https://picsum.photos/seed/b1/1200/900',
description: 'Colorful confetti birthday card.'
},
{
id: 'w-001',
title: 'Classic Wedding',
category: 'wedding',
tags: ['classic', 'elegant'],
thumb: 'https://picsum.photos/seed/w1/400/300',
full: 'https://picsum.photos/seed/w1/1200/900',
description: 'Elegant wedding invitation card.'
},
{
id: 'b-002',
title: 'Birthday Cake',
category: 'birthday',
tags: ['kids'],
thumb: 'https://picsum.photos/seed/b2/400/300',
full: 'https://picsum.photos/seed/b2/1200/900',
description: 'Cute cake illustration.'
}
];