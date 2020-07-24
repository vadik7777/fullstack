// Copyright © 2020 Vadim Konovalov. Contacts: <vadik.olympus@e1.ru>
// License: https://www.eclipse.org/legal/epl-2.0/

package rest;

import filter.CORSFilter;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import java.util.HashSet;
import java.util.Set;

@ApplicationPath("")
public class RestActivator extends Application {

    public Set<Class<?>> getClasses() {
        Set<Class<?>> clazz = new HashSet<Class<?>>();
        clazz.add(RestTreeImpl.class);
        clazz.add(CORSFilter.class);
        return clazz;
    }
}
